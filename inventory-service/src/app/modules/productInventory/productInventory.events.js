const { EVENTS, QUEUE } = require("../../../constant/eventsConstant");
const { RedisClient } = require("../../../shared/redis");
const RedisQueueService = require("../../../shared/redisQueue");
const InventoryServices = require("./productInventory.service");

const inventoryQueue = new RedisQueueService(QUEUE.INVENTORY_QUEUE);
const initInventoryEvents = () => {
  try {
    RedisClient.subscribe(
      EVENTS.INVENTORY_EVENTS.INVENTORY_CREATED,
      async (e) => {
        console.log(" event received", JSON.parse(e));
        const data = await InventoryServices.createInventoryProductIntoDB(
          JSON.parse(e)
        );
        console.log("create inventory", data);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const initInventoryQueueProcessor = () => {
  inventoryQueue.process(async (data) => {
    console.log("Processing inventory queue event:", data);
    const { taskId, data: eventData, status: taskStatus } = data;
    if (data && taskStatus === "pending") {
      console.log("first task", taskId);
      // Store metadata (status and data)
      const taskKey = `${QUEUE.INVENTORY_QUEUE}:${taskId}`;
      const status = "proccessing";
      await RedisClient.hset(
        taskId,
        taskKey,
        JSON.stringify({ eventData, status })
      );
    }
    const result =
      await InventoryServices.createInventoryProductIntoDB(eventData);
    console.log("result from inventory service in event ", result);
    if (result) {
      // Store metadata (status and data)
      const taskKey = `${QUEUE.INVENTORY_QUEUE}:${taskId}`;
      const status = "completed";
      await RedisClient.hset(
        taskId,
        taskKey,
        JSON.stringify({ eventData, status })
      );
    } else {
      const taskKey = `${QUEUE.INVENTORY_QUEUE}:${taskId}`;
      const status = "failed";
      await RedisClient.hset(
        taskId,
        taskKey,
        JSON.stringify({ eventData, status })
      );
    }
  });
};

const pushInventoryEventToQueue = async (eventData) => {
  await inventoryQueue.push(eventData);
};

module.exports = {
  initInventoryEvents,
  initInventoryQueueProcessor,
  pushInventoryEventToQueue,
};

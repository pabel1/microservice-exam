const { QUEUE } = require("../../../constant/eventsConstant");
const { RedisClient } = require("../../../shared/redis");
const RedisQueueService = require("../../../shared/redisQueue");

const orderInventoryQueue = new RedisQueueService(QUEUE.ORDER_INVENTORY_QUEUE);
const initOrderEvents = () => {
  const initOrderInventoryQueueProcessor = () => {
    orderInventoryQueue.process(async (data) => {
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
};

module.exports = {
  initOrderEvents,
};

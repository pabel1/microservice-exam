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
    // await InventoryServices.createInventoryProductIntoDB(data);
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

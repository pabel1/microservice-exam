const { QUEUE } = require("../../../constant/eventsConstant");
const RedisQueueService = require("../../../shared/redisQueue");

const inventoryQueue = new RedisQueueService(QUEUE.INVENTORY_QUEUE);

const initProductEvents = () => {};

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
  initProductEvents,
  initInventoryQueueProcessor,
  pushInventoryEventToQueue,
};

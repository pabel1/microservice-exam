const { QUEUE } = require("../../../constant/eventsConstant");
const { RedisClient } = require("../../../shared/redis");
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
  //  need to create taskID and send to queue with status
  const taskID = `${QUEUE.INVENTORY_QUEUE}:${eventData._id}`;
  const taskKey = `${QUEUE.INVENTORY_QUEUE}:${taskID}`;
  const status = "pending";
  await inventoryQueue.push(taskID, eventData, status);

  // Store metadata (status and data)
  await RedisClient.hset(
    taskID,
    taskKey,
    JSON.stringify({ eventData, status })
  );
};

module.exports = {
  initProductEvents,
  initInventoryQueueProcessor,
  pushInventoryEventToQueue,
};

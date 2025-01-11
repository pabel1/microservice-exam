const { QUEUE } = require("../../../constant/eventsConstant");
const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const { RedisClient } = require("../../../shared/redis");
const InventoryModel = require("./productInventory.model");
const httpStatus = require("http-status");

const createInventoryProductIntoDB = async (payload) => {
  const newPayload = {
    // productId: payload._id,
    sku: payload._id,
    quantity: payload.quantity || 200,
    reorderPoint: payload.reorderPoint || 100,
  };
  const isExist = await InventoryModel.findOne({
    productId: newPayload.productId,
  });
  if (isExist) {
    throw new ErrorHandler(
      `${isExist.productId} this Product already axist!`,
      httpStatus.CONFLICT
    );
  }

  const product = new InventoryModel(newPayload);
  console.log("product", product);
  const newProduct = await product.save();
  console.log("newProduct", newProduct);
  return newProduct;
};
const getProductFromRedis = async (id) => {
  const taskID = `${QUEUE.INVENTORY_QUEUE}:${id}`; //taskID
  const taskKey = `${QUEUE.INVENTORY_QUEUE}:${taskID}`;
  const result = await RedisClient.hget(taskID, taskKey);

  console.log("result", result);
  return JSON.parse(result);
};

const InventoryServices = {
  createInventoryProductIntoDB,
  getProductFromRedis,
};

module.exports = InventoryServices;

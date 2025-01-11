const generateSlug = require("../../../shared/generateSlug");

const httpStatus = require("http-status");

const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const ProductModel = require("./product.model");
const { RedisClient } = require("../../../shared/redis");
const { EVENTS } = require("../../../constant/eventsConstant");
const { pushInventoryEventToQueue } = require("./product.event");

const createProductIntoDB = async (payload) => {
  const isExist = await ProductModel.findOne({
    slug: generateSlug(payload.productName),
  });
  if (isExist) {
    throw new ErrorHandler(
      `${isExist.productName} this Product already axist!`,
      httpStatus.CONFLICT
    );
  }

  const product = new ProductModel(payload);
  const newProduct = await product.save();

  // set product in redis for inventory add
  if (newProduct) {
    // await RedisClient.publish(
    //   EVENTS.INVENTORY_EVENTS.INVENTORY_CREATED,
    //   JSON.stringify(newProduct)
    // );
    await pushInventoryEventToQueue(newProduct);
  }
  return newProduct;
};

const productServices = {
  createProductIntoDB,
};

module.exports = productServices;

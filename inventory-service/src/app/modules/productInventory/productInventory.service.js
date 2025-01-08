const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const InventoryModel = require("./productInventory.model");
const httpStatus = require("http-status");

const createInventoryProductIntoDB = async (payload) => {
  const isExist = await InventoryModel.findOne({
    productId: payload.productId,
  });
  if (isExist) {
    throw new ErrorHandler(
      `${isExist.productId} this Product already axist!`,
      httpStatus.CONFLICT
    );
  }

  const product = new InventoryModel(payload);
  const newProduct = await product.save();
  return newProduct;
};

const InventoryServices = {
  createInventoryProductIntoDB,
};

module.exports = InventoryServices;

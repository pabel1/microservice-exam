const generateSlug = require("../../../shared/generateSlug");

const httpStatus = require("http-status");

const ErrorHandler = require("../../../ErrorHandler/errorHandler");
const ProductModel = require("./product.model");

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
  return newProduct;
};

const productServices = {
  createProductIntoDB,
};

module.exports = productServices;

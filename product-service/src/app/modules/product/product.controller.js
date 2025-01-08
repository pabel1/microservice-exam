const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const sendResponse = require("../../../shared/sendResponse");
const productServices = require("./product.service");
const httpStatus = require("http-status");
const createProduct = catchAsyncError(async (req, res) => {
  const result = await productServices.createProductIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully",
    data: {
      result,
    },
  });
});

const productController = {
  createProduct,
  // getAllProduct,
};
module.exports = productController;

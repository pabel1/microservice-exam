const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const sendResponse = require("../../../shared/sendResponse");

const httpStatus = require("http-status");
const orderServices = require("./order.service");
const createOrder = catchAsyncError(async (req, res) => {
  const result = await orderServices.createOrderIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order  created successfully",
    data: {
      result,
    },
  });
});

const orderController = {
  createOrder,
};
module.exports = orderController;

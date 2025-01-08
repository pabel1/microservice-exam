const catchAsyncError = require("../../../ErrorHandler/catchAsyncError");
const sendResponse = require("../../../shared/sendResponse");
const InventoryServices = require("./productInventory.service");
const httpStatus = require("http-status");
const createInventoryProduct = catchAsyncError(async (req, res) => {
  const result = await InventoryServices.createInventoryProductIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully",
    data: {
      result,
    },
  });
});

const inventoryController = {
  createInventoryProduct,
};
module.exports = inventoryController;

/* eslint-disable node/no-extraneous-require */
const express = require("express");
const JoiInventoryProductValidationSchema = require("./productInventory.validation");
const inventoryController = require("./productInventory.controller");
const validateRequest = require("../../../Middleware/validateRequest");

const router = express.Router();

router.post(
  "/create",
  validateRequest(
    JoiInventoryProductValidationSchema.createInventoryProductValidationSchema
  ),
  inventoryController.createInventoryProduct
);

router.get(
  "/get-product-from-redis/:id",
  inventoryController.getProductFromRedisWithStatus
);

const inventoryRouter = router;

module.exports = inventoryRouter;

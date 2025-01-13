/* eslint-disable node/no-extraneous-require */
const express = require("express");

const validateRequest = require("../../../Middleware/validateRequest");
const JoiOrderValidationSchema = require("./order.validation");
const orderController = require("./order.controller");
const authVerification = require("../../../Middleware/authVarification");

const router = express.Router();

router.post(
  "/create",
  authVerification,
  validateRequest(JoiOrderValidationSchema.createOrderValidationSchema),
  orderController.createOrder
);

const orderRouter = router;

module.exports = orderRouter;

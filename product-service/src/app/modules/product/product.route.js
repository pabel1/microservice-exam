/* eslint-disable node/no-extraneous-require */
const express = require("express");
const validateRequest = require("../../../Middleware/validateRequest");
const JoiProductValidationSchema = require("./product.validation");
const productController = require("./product.controller");
const authVerification = require("../../../Middleware/authVarification");

const router = express.Router();

router.post(
  "/create",
  authVerification,
  validateRequest(JoiProductValidationSchema.createProductValidationSchema),
  productController.createProduct
);

router.post(
  "/bulk-create",
  authVerification,
  productController.createProduct
);

const productRouter = router;

module.exports = productRouter;

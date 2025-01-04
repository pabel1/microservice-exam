/* eslint-disable node/no-extraneous-require */
const express = require("express");
const validateRequest = require("../../../Middleware/validateRequest");
const JoiValidationSchema = require("./user.validation");
const userController = require("./user.controller");

const router = express.Router();

router.post(
  "/create",
  validateRequest(JoiValidationSchema.userJoiSchema),
  userController.userRegistration
);

router.post(
  "/login",
  validateRequest(JoiValidationSchema.loginSchema),
  userController.userLogin
);
// router.get("/logged-in-user", authVerification, userController.loggedInUser);

// router.post(
//   "/refresh-token",
//   validateRequest(JoiValidationSchema.refreshTokenJoiSchema),
//   userController.refreshToken
// );
// router.post("/logout", userController.logout);

const userRouter = router;

module.exports = userRouter;

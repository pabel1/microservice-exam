const Joi = require("joi");

const userJoiSchema = Joi.object({
  fullname: Joi.string().required().messages({
    "any.required": "Please enter Your Name",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid Email",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),

  phone: Joi.string().length(11).trim().messages({
    "string.length": "Phone number must be 11 digits",
  }),
  gender: Joi.string().valid("Male", "Female", "Others"),
  userStatus: Joi.string()
    .valid("Active", "Block", "Restricted")
    .default("Active"),
  role: Joi.string().valid("user", "admin").default("user"),
});

// Validation schema for login with custom error messages
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Customize email validation if needed
    .required()
    .messages({
      "string.empty": "Email is required",
      "any.required": "Email is required",
      "string.email": "Invalid email format",
    }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

const refreshTokenJoiSchema = Joi.object({
  cookies: Joi.object({
    refreshToken: Joi.string()
      .required()
      .error(new Error("Refresh Token is required")),
  }),
});

const JoiValidationSchema = {
  userJoiSchema,
  loginSchema,
  refreshTokenJoiSchema,
};

module.exports = JoiValidationSchema;

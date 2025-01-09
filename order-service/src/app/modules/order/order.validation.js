const Joi = require("joi");

const createOrderValidationSchema = Joi.object({
  userId: Joi.string().required().messages({
    "any.required": "User ID is required.",
    "string.empty": "User ID cannot be empty.",
  }),
  productId: Joi.string().required().messages({
    "any.required": "Product ID is required.",
    "string.empty": "Product ID cannot be empty.",
  }),
  quantity: Joi.number().min(1).required().messages({
    "any.required": "Quantity is required.",
    "number.base": "Quantity must be a number.",
    "number.min": "Quantity must be at least 1.",
  }),
  price: Joi.number().required().messages({
    "any.required": "Price is required.",
    "number.base": "Price must be a number.",
  }),
  shippingAddress: Joi.string().allow(null, "").messages({
    "string.base": "Shipping Address must be a valid string.",
  }),
  payment: Joi.string().allow(null, "").messages({
    "string.base": "Payment must be a valid string.",
  }),
  orderStatus: Joi.string()
    .valid("Processing", "Shipped", "Delivered", "Cancelled")
    .default("Processing")
    .messages({
      "any.only":
        "Order status must be one of 'Processing', 'Shipped', 'Delivered', or 'Cancelled'.",
    }),
  totalAmount: Joi.number().required().messages({
    "any.required": "Total amount is required.",
    "number.base": "Total amount must be a number.",
  }),
});

const JoiOrderValidationSchema = {
  createOrderValidationSchema,
};

module.exports = JoiOrderValidationSchema;

const Joi = require("joi");

const createInventoryProductValidationSchema = Joi.object({
  productId: Joi.string().required().messages({
    "string.empty": "Product ID is required.",
    "any.required": "Product ID is required.",
  }),
  sku: Joi.string().required().messages({
    "string.empty": "SKU is required.",
    "any.required": "SKU is required.",
  }),
  quantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Quantity must be a number.",
    "number.integer": "Quantity must be an integer.",
    "number.min": "Quantity cannot be less than 0.",
    "any.required": "Quantity is required.",
  }),
  reorderPoint: Joi.number().integer().min(0).required().messages({
    "number.base": "Reorder point must be a number.",
    "number.integer": "Reorder point must be an integer.",
    "number.min": "Reorder point cannot be less than 0.",
    "any.required": "Reorder point is required.",
  }),
  status: Joi.string()
    .valid("IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK")
    .optional()
    .messages({
      "string.base": "Status must be a string.",
      "any.only": "Status must be one of IN_STOCK, LOW_STOCK, or OUT_OF_STOCK.",
    }),
  locationInWarehouse: Joi.string().optional().allow("").messages({
    "string.base": "Location in warehouse must be a string.",
  }),
  batch: Joi.object({
    batchNumber: Joi.string().optional().allow("").messages({
      "string.base": "Batch number must be a string.",
    }),
    manufacturingDate: Joi.date().optional().messages({
      "date.base": "Manufacturing date must be a valid date.",
    }),
    expiryDate: Joi.date().optional().messages({
      "date.base": "Expiry date must be a valid date.",
    }),
  }).optional(),
});

const JoiInventoryProductValidationSchema = {
  createInventoryProductValidationSchema,
};

module.exports = JoiInventoryProductValidationSchema;

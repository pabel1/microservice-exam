const Joi = require("joi");

const createProductValidationSchema = Joi.object({
  productName: Joi.string().required().messages({
    "string.empty": "Product name is required.",
    "any.required": "Product name is required.",
  }),
  productPrice: Joi.number().required().messages({
    "number.base": "Product price must be a number.",
    "any.required": "Product price is required.",
  }),
  discount: Joi.number().required().messages({
    "number.base": "Discount must be a number.",
    "any.required": "Discount is required.",
  }),
  productDescription: Joi.string().required().messages({
    "string.empty": "Product description is required.",
    "any.required": "Product description is required.",
  }),
  productDetails: Joi.string().required().messages({
    "string.empty": "Product details are required.",
    "any.required": "Product details are required.",
  }),
  category: Joi.string().required().messages({
    "string.empty": "Category is required.",
    "any.required": "Category is required.",
  }),
  productTags: Joi.string().optional().allow("").messages({
    "string.base": "Product tags must be a string.",
  }),
  slug: Joi.string().optional().lowercase().messages({
    "string.base": "Slug must be a string.",
  }),
});
const JoiProductValidationSchema = {
  createProductValidationSchema,
};

module.exports = JoiProductValidationSchema;

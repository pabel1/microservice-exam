const mongoose = require("mongoose");
const generateSlug = require("../../../shared/generateSlug");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productDetails: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    productTags: {
      type: String,
    },

    slug: {
      type: String,

      lowercase: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// composite key created for uniqueness
productSchema.pre("save", function (next) {
  if (this.isModified("productName") || this.isNew) {
    this.slug = generateSlug(this.productName);
  }

  next();
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;

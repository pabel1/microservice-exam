const { default: mongoose } = require("mongoose");

const inventorySchema = new mongoose.Schema(
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      sku: {
        type: String,
        required: true,
        unique: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 0,
      },
      reorderPoint: {
        type: Number,
        required: true,
        default: 10,
      },
      status: {
        type: String,
        enum: ["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"],
        default: "IN_STOCK",
      },
      locationInWarehouse: {
        type: String,
      },
      batch: {
        batchNumber: String,
        manufacturingDate: Date,
        expiryDate: Date,
      }
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

  // Middleware to update status based on quantity
inventorySchema.pre("save", function (next) {
    if (this.quantity <= 0) {
      this.status = "OUT_OF_STOCK";
    } else if (this.quantity <= this.reorderPoint) {
      this.status = "LOW_STOCK";
    } else {
      this.status = "IN_STOCK";
    }
    next();
  });

  const InventoryModel = mongoose.model("Inventory", inventorySchema);

module.exports = InventoryModel;
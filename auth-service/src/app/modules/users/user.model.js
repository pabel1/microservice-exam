const mongoose = require("mongoose");
const validator = require("validator");

const bcrypt = require("bcryptjs");
const config = require("../../../config/config");
const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Please enter Your Name"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      length: [11, "Phone number must be 11 digits"],
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
    },

    userStatus: {
      type: String,
      enum: ["Active", "Block", "Restricted"],
      default: "Active",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds) || 10
  );
  next();
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;

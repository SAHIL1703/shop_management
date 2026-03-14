// models/shop.model.js
import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    shopName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    shopType: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    shopImage: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

shopSchema.index({ userId: 1, shopName: 1 }, { unique: true });
const Shop = mongoose.model("Shop", shopSchema);
export default Shop;
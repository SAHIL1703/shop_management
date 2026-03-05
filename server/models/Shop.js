// models/shop.model.js
import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
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

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;
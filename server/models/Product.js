import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  // The Tenant Link
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },

  // Core Details
  name: { type: String, required: true },
  brand: { type: String },
  category: { type: String, required : true }, 
  
  // NEW: The Product Image
  productImage: { 
    type: String, 
    default: null // Will hold the Cloudinary URL (e.g., "https://res.cloudinary.com/...")
  },
  
  // The Variants (Sizes, Colors, etc.)
  variants: [{
    size: String,   // e.g., "10ml"
    color: String,  // e.g., "Red"
    purchasePrice: { type: Number, default: 0 },
    sellingPrice: { type: Number, required: true },
    stockQuantity: { type: Number, required: true, min: 0 }
  }],

  specifications: { type: Map, of: String }

}, { timestamps: true });

// Index for super-fast searching within a specific shop
productSchema.index({ shopId: 1, name: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
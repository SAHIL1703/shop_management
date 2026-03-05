import mongoose from 'mongoose';

const saleEntrySchema = new mongoose.Schema({
  // The Tenant Link
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true, index: true },

  // What was sold
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId }, // Auto-generated ID of the variant
  variantName: { type: String, trim: true }, // e.g., "10ml"

  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true }, // The exact money taken

  // Who sold it? (Optional)
  salespersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labor' },

  date: { type: Date, default: Date.now }
});

// Index to quickly generate "Today's Revenue" for the owner's dashboard
saleEntrySchema.index({ shopId: 1, date: -1 });

const SaleEntry = mongoose.model('SaleEntry', saleEntrySchema);
export default SaleEntry;
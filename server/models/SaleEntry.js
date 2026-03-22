import mongoose from 'mongoose';

//Schema for the saleItems
const saleItemSchema = mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId }, // Auto-generated ID of the variant
  variantName: { type: String, trim: true }, // e.g., "10ml"

  quantity: { type: Number, required: true, min: 1 },
  pricePerUnit : {type : Number , required : true},

  // quantity * pricePerUnit
  subTotal : { type: Number, required: true }, // The exact money taken
})

const saleEntrySchema = new mongoose.Schema({
  // The Tenant Link
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true, index: true },

  //items Arrays
  items : [saleItemSchema],

  // The final money taken from the customer for everything
  grandTotal: { type: Number, required: true },

  // Who sold it? (Optional)
  salespersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labor' },

  date: { type: Date, default: Date.now }
});

// Index to quickly generate "Today's Revenue" for the owner's dashboard
saleEntrySchema.index({ shopId: 1, date: -1 });

const SaleEntry = mongoose.model('SaleEntry', saleEntrySchema);
export default SaleEntry;
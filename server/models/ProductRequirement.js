import mongoose from 'mongoose';

const productRequirementSchema = new mongoose.Schema({
  // The Tenant Link
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },

  productName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 200
  },
  description: { type: String, trim: true },

  referenceImage: {
    url: String,
    publicId: String
  },

  quantity: { type: Number, required: true, min: 1 },

  customerDetails: {
    name: { type: String, trim: true },
    phone: { type: String, required: true }
  },

  status: {
    type: String,
    enum: ['Pending', 'Ordered', 'Arrived', 'Fulfilled', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

productRequirementSchema.index({ shopId: 1, status: 1 });

const ProductRequirement = mongoose.model('ProductRequirement', productRequirementSchema);
export default ProductRequirement;
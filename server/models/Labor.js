import mongoose from 'mongoose';

const laborSchema = new mongoose.Schema({
  // The Tenant Link
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },

  name: { type: String, required: true },
  phone: { type: String, required: true },

  // FIXED: Properly define the nested fields. 
  // If idProof is mandatory, apply 'required' to its inner fields.
  idProof: {
    url: { type: String },                            // Link to uploaded image
    type: { type: String, required: true },           // e.g., "Aadhar"
    number: { type: String, required: true } 
  },

  joiningDate: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ['Salesperson', 'Helper', 'Manager', 'Cleaner'],
    default: 'Helper'
  },

  baseSalary: { type: Number, required: true },
  salaryType: { type: String, enum: ['Monthly', 'Daily'], default: 'Monthly' },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

laborSchema.index({ shopId: 1, isActive: 1 });

const Labor = mongoose.model('Labor', laborSchema);
export default Labor;
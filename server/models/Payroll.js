import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  // The Tenant Link
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  
  // The worker receiving the money
  laborId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labor', required: true },
  
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['Salary', 'Advance', 'Bonus', 'Deduction'], 
    required: true 
  },
  
  forMonth: { type: Date }, // E.g., Payment for "October 2023"
  description: { type: String },
  
  date: { type: Date, default: Date.now }
});

payrollSchema.index({ shopId: 1, laborId: 1, date: -1 });

const Payroll = mongoose.model('Payroll', payrollSchema);
export default Payroll;
import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  // The Tenant Link
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },

  // Who helped the customer?
  salespersonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labor', required: true },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: "Rating must be an integer"
    }
  },
  customerPhone: { type: String, default: null },

  date: { type: Date, default: Date.now }
});

feedbackSchema.index({ shopId: 1, salespersonId: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
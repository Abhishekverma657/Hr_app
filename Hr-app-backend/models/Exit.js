import mongoose from 'mongoose';

const exitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: String,
  resignationDate: Date, // proposed last working date
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Exit', exitSchema);

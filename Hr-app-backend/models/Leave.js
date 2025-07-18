import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['CL', 'SL', 'PL'], required: true }, // Casual/Sick/Privilege
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Leave', leaveSchema);

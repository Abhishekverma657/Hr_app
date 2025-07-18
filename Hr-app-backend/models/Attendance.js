import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  checkIn: Date,
  checkOut: Date,
}, { timestamps: true });

attendanceSchema.index({ user: 1, date: 1 }, { unique: true }); // One record per user per day

export default mongoose.model('Attendance', attendanceSchema);

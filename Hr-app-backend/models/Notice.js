import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: String,
  message: String,
  fromDate: Date,
  toDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Notice', noticeSchema);

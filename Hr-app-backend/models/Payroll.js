import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  month: { type: String, required: true }, // Format: '2025-07'
  basic: Number,
  hra: Number,
  bonus: Number,
  deductions: Number,
  netSalary: Number,
}, { timestamps: true });

payrollSchema.index({ user: 1, month: 1 }, { unique: true }); // Unique payroll per user per month

export default mongoose.model('Payroll', payrollSchema);

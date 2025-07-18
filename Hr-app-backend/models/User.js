import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  department: String,
  designation: String,
  joiningDate: Date,
  status: { type: String, enum: ['active', 'resigned'], default: 'active' },
  phone: String,
  address: String,
  photo: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);

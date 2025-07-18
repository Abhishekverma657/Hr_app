import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });
  res.status(201).json({ token: generateToken(user._id, user.role) });
};

// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   const isMatch = user && (await bcrypt.compare(password, user.password));

//   if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

//   res.json({
//      token: generateToken(user._id, user.role), role: user.role 

//   });
// };
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const isMatch = user && (await bcrypt.compare(password, user.password));

  if (!isMatch)
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user._id, user.role);

  // remove password before sending
  const { password: _, ...userData } = user.toObject();

  res.status(200).json({
    token,
    user: userData,
  });
};


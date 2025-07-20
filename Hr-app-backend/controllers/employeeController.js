import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';
 

// GET all employees
export const getEmployees = async (req, res) => {
  const users = await User.find({ role: 'employee' });
  res.json(users);
};
// controller
export const getMyProfile = async (req, res) => {
   try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error("❌ Error in getMyProfile:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
// controller/employeeController.js
 ;

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "✅ Password updated successfully" });
};



// GET single employee by ID
export const getEmployee = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Employee not found' });
  res.json(user);
};

// ADD new employee (Admin adds employee)
export const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
      designation,
      joiningDate,
      phone,
      address
    } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    let uploadedPhotoUrl = '';

    if (req.file) {
      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'hr-app/employees' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer); // upload from memory
      });

      uploadedPhotoUrl = uploaded.secure_url;
    }

    const user = new User({
      name,
      email,
      password: hashed,
      role: role || 'employee',
      department,
      designation,
      joiningDate,
      phone,
      address,
      photo: uploadedPhotoUrl || '', // ✅ Cloudinary URL
    });

    await user.save();
    res.status(201).json({ message: 'Employee created', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error creating employee', error: err.message });
  }
};
// export const addEmployee = async (req, res) => {
//   const { name, email, password, role, department, designation, joiningDate, phone, address  } = req.body;
//   const hashed = await bcrypt.hash(password, 10);
//     let uploadedPhotoUrl = '';

//     if (req.file) {
//       const uploaded = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: 'hr-app/employees' },
//           (error, result) => {
//             if (error) return reject(error);
//             resolve(result);
//           }
//         );
//         stream.end(req.file.buffer); // upload from memory
//       });

//       uploadedPhotoUrl = uploaded.secure_url;
//     }

//   const user = new User({
//     name,
//     email,
//     password: hashed,
//     role: role || 'employee',
//     department,
//     designation,
//     joiningDate,
//     phone,
//     address,
//     photo: uploadedPhotoUrl || '',
//   });

//   await user.save();
//   res.status(201).json({ message: 'Employee created', user });
// };

// UPDATE employee info
export const updateEmployee = async (req, res) => {
  const updateFields = { ...req.body };
  if (updateFields.password) {
    updateFields.password = await bcrypt.hash(updateFields.password, 10);
  }
  const user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });
  res.json(user);
};

// DELETE employee
export const deleteEmployee = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Employee deleted' });
};

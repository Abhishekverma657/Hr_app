import Attendance from '../models/Attendance.js';
import mongoose from 'mongoose';
// import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import cloudinary from '../config/cloudinary.js';


// Employee - Check In
export const checkIn = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  const existing = await Attendance.findOne({
    user: req.user.id,
    date: { $gte: new Date(today), $lt: new Date(`${today}T23:59:59`) },
  });

  if (existing) return res.status(400).json({ message: 'Already checked in today' });

  const attendance = new Attendance({
    user: req.user.id,
    checkIn: new Date(),
  });

  await attendance.save();
  res.status(201).json({ message: 'Checked in', attendance });
};

// Employee - Check Out
export const checkOut = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  const record = await Attendance.findOne({
    user: req.user.id,
    date: { $gte: new Date(today), $lt: new Date(`${today}T23:59:59`) },
  });

  if (!record) return res.status(404).json({ message: 'No check-in record found' });
  if (record.checkOut) return res.status(400).json({ message: 'Already checked out' });

  record.checkOut = new Date();
  await record.save();

  res.json({ message: 'Checked out', record });
};

// Employee - View Own Attendance
export const myAttendance = async (req, res) => {
  const records = await Attendance.find({ user: req.user.id }).sort({ date: -1 });
  res.json(records);
};

// Admin - View All Attendance
export const allAttendance = async (req, res) => {
  const { userId, date } = req.query;
  let filter = {};

  if (userId) filter.user = userId;
  if (date) {
    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    filter.date = { $gte: dayStart, $lte: dayEnd };
  }

  const records = await Attendance.find(filter).populate('user', 'name email');
  res.json(records);
};






 
// Utility: Upload temp photo to Cloudinary
const uploadToCloudinary = async (buffer) => {
  const uploaded = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'hr-app/temp-checkin' },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
  return uploaded.secure_url;
};

// export const faceCheckInOut = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const user = await User.findById(userId);
   

//     if (!user || !user.photo) return res.status(400).json({ message: 'User or photo not found' });

//     // Step 1: Upload live photo (file from form-data) to Cloudinary
//     if (!req.file) return res.status(400).json({ message: 'No image provided' });
//     const livePhotoUrl = await uploadToCloudinary(req.file.buffer);

//     // Step 2: Call FastAPI for face verification
//     const form = new FormData();
//     form.append('cloud_image_url', livePhotoUrl);
//     form.append('stored_image_url', user.photo);
//     console.log(livePhotoUrl);
//     console.log(user.photo);

//     const verifyRes = await axios.post('http://localhost:4500/verify-face', form, {
//       headers: form.getHeaders()
//     });

//     const { matched, confidence } = verifyRes.data;

//     if (!matched || confidence < 85) {
//       return res.status(401).json({ message: 'Face mismatch or low confidence', confidence });
//     }

//     // Step 3: Check today's attendance
//     const today = new Date().toISOString().split('T')[0];
//     const existing = await Attendance.findOne({
//       user: userId,
//       date: { $gte: new Date(today), $lt: new Date(`${today}T23:59:59`) },
//     });

//     if (!existing) {
//       // First scan → Check-in
//       const attendance = new Attendance({
//         user: userId,
//         checkIn: new Date(),
//       });
//       await attendance.save();
//       return res.status(201).json({ message: '✅ Checked In Successfully', attendance });
//     }

//     if (!existing.checkOut) {
//       // Second scan → Check-out
//       existing.checkOut = new Date();
//       await existing.save();
//       return res.status(200).json({ message: '✅ Checked Out Successfully', attendance: existing });
//     }

//     return res.status(400).json({ message: 'Already checked in and out for today' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Something went wrong', error: err.message });
//   }
// };

 

export const faceCheckInOut = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image provided' });

    // Step 1: Upload live image to Cloudinary
    const livePhotoUrl = await uploadToCloudinary(req.file.buffer);

    // Step 2: Get all users
    const users = await User.find({ role: 'employee' });

    let matchedUser = null;
    let confidenceScore = 0;

    // Step 3: Loop over all user photos and match
    for (const user of users) {
      if (!user.photo) continue;

      const form = new FormData();
      form.append('cloud_image_url', livePhotoUrl);
      form.append('stored_image_url', user.photo);

      try {
        const verifyRes = await axios.post('http://localhost:4500/verify-face', form, {
          headers: form.getHeaders(),
        });

        const { matched, confidence } = verifyRes.data;
        console.log('Confidence:', confidence);

        if (matched && confidence >= 60) {
          matchedUser = user;
          confidenceScore = confidence;
          break;
        }
      } catch (err) {
        console.error(err);
        // Silent fail if face not matched
        continue;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({ message: '❌ Face not recognized with any employee.' });
    }

    // Step 4: Attendance logic
    const userId = matchedUser._id;
    const today = new Date().toISOString().split('T')[0];
    const existing = await Attendance.findOne({
      user: userId,
      date: { $gte: new Date(today), $lt: new Date(`${today}T23:59:59`) },
    });

    if (!existing) {
      const attendance = new Attendance({
        user: userId,
        checkIn: new Date(),
      });
      await attendance.save();
      return res.status(201).json({
        message: `✅ ${matchedUser.name} Checked In`,
        confidence: confidenceScore,
        attendance,
      });
    }

    if (!existing.checkOut) {
      existing.checkOut = new Date();
      await existing.save();
      return res.status(200).json({
        message: `✅ ${matchedUser.name} Checked Out`,
        confidence: confidenceScore,
        attendance: existing,
      });
    }

    return res.status(400).json({ message: '✅ Already Checked In & Out today.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Internal Error', error: err.message });
  }
};


import Notice from '../models/Notice.js';

// Admin - Create notice
export const createNotice = async (req, res) => {
  const { title, message, fromDate, toDate } = req.body;

  const notice = await Notice.create({
    title,
    message,
    fromDate,
    toDate,
    createdBy:  req.user.id,
  });

  res.status(201).json({ message: 'Notice created', notice });
};

// Employee - Get active notices
export const getActiveNotices = async (req, res) => {
  const today = new Date();
  const notices = await Notice.find({
    fromDate: { $lte: today },
    toDate: { $gte: today },
  }).sort({ fromDate: -1 });

  res.json(notices);
};

// Admin - Get all notices
export const getAllNotices = async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 }).populate('createdBy', 'name');
  res.json(notices);
};

// Admin - Delete notice
export const deleteNotice = async (req, res) => {
  await Notice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Notice deleted' });
};

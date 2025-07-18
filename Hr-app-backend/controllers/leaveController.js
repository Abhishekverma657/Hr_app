import Leave from '../models/Leave.js';

// Apply for leave (employee)
export const applyLeave = async (req, res) => {
  const { type, fromDate, toDate, reason } = req.body;

  const leave = new Leave({
    user: req.user.id,
    type,
    fromDate,
    toDate,
    reason,
  });

  await leave.save();
  res.status(201).json({ message: 'Leave applied successfully', leave });
};

// Get own leave history
export const myLeaves = async (req, res) => {
  const leaves = await Leave.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(leaves);
};

// Admin: get all leave applications
export const allLeaves = async (req, res) => {
  const { userId } = req.query;
  let filter = {};

  if (userId) filter.user = userId;

  const leaves = await Leave.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(leaves);
};

// Admin: update leave status (approve/reject)
export const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;
  const leave = await Leave.findById(req.params.id);

  if (!leave) return res.status(404).json({ message: 'Leave not found' });

  leave.status = status;
  await leave.save();

  res.json({ message: `Leave ${status}`, leave });
};

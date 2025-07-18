import Exit from '../models/Exit.js';

// Employee: Apply for resignation
export const applyResignation = async (req, res) => {
  const { reason, resignationDate } = req.body;

  const alreadyRequested = await Exit.findOne({ user: req.user.id, status: 'pending' });
  if (alreadyRequested)
    return res.status(400).json({ message: 'Already applied for resignation' });

  const exit = await Exit.create({
    user: req.user.id,
    reason,
    resignationDate,
  });

  res.status(201).json({ message: 'Resignation request submitted', exit });
};

// Employee: Get my resignation status
export const myResignation = async (req, res) => {
  const exits = await Exit.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(exits);
};

// Admin: Get all resignation requests
export const getAllResignations = async (req, res) => {
  const requests = await Exit.find().populate('user', 'name email department').sort({ createdAt: -1 });
  res.json(requests);
};

// Admin: Update status (approve/reject)
export const updateResignationStatus = async (req, res) => {
  const { status } = req.body;

  const request = await Exit.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Request not found' });

  request.status = status;
  await request.save();

  res.json({ message: `Resignation ${status}`, request });
};

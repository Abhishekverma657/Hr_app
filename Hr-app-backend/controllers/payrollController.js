import Payroll from '../models/Payroll.js';

// Admin: Create or update payroll
export const createOrUpdatePayroll = async (req, res) => {
  const { userId, month, basic, hra, bonus, deductions } = req.body;

  const netSalary = basic + hra + bonus - deductions;

  const existing = await Payroll.findOne({ user: userId, month });

  if (existing) {
    // Update existing payroll
    existing.basic = basic;
    existing.hra = hra;
    existing.bonus = bonus;
    existing.deductions = deductions;
    existing.netSalary = netSalary;
    await existing.save();
    return res.json({ message: 'Payroll updated', payroll: existing });
  }

  const payroll = await Payroll.create({
    user: userId,
    month,
    basic,
    hra,
    bonus,
    deductions,
    netSalary,
  });

  res.status(201).json({ message: 'Payroll created', payroll });
};

// Admin: Get payrolls (filter by user/month)
export const getPayrolls = async (req, res) => {
  const { userId, month } = req.query;
  const filter = {};

  if (userId) filter.user = userId;
  if (month) filter.month = month;

  const payrolls = await Payroll.find(filter).populate('user', 'name email');
  res.json(payrolls);
};

// Employee: View own payslips
export const myPayslips = async (req, res) => {
  const slips = await Payroll.find({ user: req.user.id }).sort({ month: -1 });
  res.json(slips);
};

import jwt from 'jsonwebtoken';
import Admin from '../models/admin.models.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      token: signToken(admin._id),
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) { next(error); }
};

export const getMe = async (req, res) => {
  res.status(200).json({ success: true, admin: req.admin });
};

// One-time seed — disable after first use by removing or commenting the route
export const seedAdmin = async (req, res, next) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0)
      return res.status(400).json({ success: false, message: 'Admin already exists. Seed disabled.' });

    const admin = await Admin.create({
      name: req.body.name || 'Admin',
      email: req.body.email,
      password: req.body.password,
      role: 'superadmin',
    });

    res.status(201).json({
      success: true,
      message: 'Admin created. Remove the /seed route from adminRoutes.js now.',
      token: signToken(admin._id),
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) { next(error); }
};
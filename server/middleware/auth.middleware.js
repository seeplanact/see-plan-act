import jwt from 'jsonwebtoken';
import Admin from '../models/admin.models.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : null;

    if (!token)
      return res.status(401).json({ success: false, message: 'Not authorized — no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin)
      return res.status(401).json({ success: false, message: 'Admin not found' });

    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Not authorized — invalid token' });
  }
};
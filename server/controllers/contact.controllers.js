import { validationResult } from 'express-validator';
import Contact from '../models/contact.models.js';
import { sendContactNotification } from '../services/email.service.js';
import { logger } from '../configs/logger.config.js';

// @desc    Submit contact form — saves to DB + sends email
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    // Save to MongoDB
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip,
    });

    // Send notification email (non-blocking — don't fail the request if email fails)
    sendContactNotification({ name, email, subject, message }).catch((err) => {
      logger.error(`Email notification failed for contact ${contact._id}: ${err.message}`);
    });

    res.status(201).json({
      success: true,
      message: "Thank you! We've received your message and will be in touch soon.",
      data: { id: contact._id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contacts (admin)
// @route   GET /api/admin/contacts
// @access  Private/Admin
export const getContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const { status } = req.query;
    const filter = status ? { status } : {};

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark contact as read
// @route   PATCH /api/admin/contacts/:id/read
// @access  Private/Admin
export const markContactRead = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const sign = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
const safeUser = u => ({ id: u._id, name: u.name, email: u.email, role: u.role, avatar: u.avatar, bio: u.bio });

exports.register = async (req, res, next) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ message: errs.array()[0].msg });
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email ya en uso' });
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: sign(user._id), user: safeUser(user) });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ message: errs.array()[0].msg });
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    res.json({ token: sign(user._id), user: safeUser(user) });
  } catch (e) { next(e); }
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart.product');
  res.json(user);
};

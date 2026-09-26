import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import '../config/env.js';

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required in backend/.env');
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { name, mobile, email, aadhaar, password } = req.body;
  const userExists = await User.findOne({ $or: [{ email }, { mobile }, { aadhaar }] });

  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, mobile, email, aadhaar, password });
  if (user) {
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      aadhaar: user.aadhaar, token: generateToken(user._id),
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id, name: user.name, email: user.email,
      aadhaar: user.aadhaar, token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
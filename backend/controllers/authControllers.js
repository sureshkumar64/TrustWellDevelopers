// backend/controllers/authControllers.js
import admin from '../config/firebase.js';
import User from '../models/user.js';
import Property from '../models/Property.js';
import { logUserToExcel } from '../utils/userLogger.js'; // ✅ Excel log utility

// 🔐 Login controller
export const loginUser = async (req, res) => {
  const adminNumbers = ['6006061464'];

  try {
    const { token, name } = req.body;
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, phone_number } = decoded;

    const phone = phone_number.replace('+91', '');
    const role = adminNumbers.includes(phone) ? 'admin' : 'user';

    let user = await User.findOne({ uid });

    const isNewUser = !user;

    if (isNewUser) {
      user = await User.create({
        name,
        role,
        uid,
        phone,
        isAdmin: role === 'admin',
        likedProperties: []
      });

      await logUserToExcel({ name, phone }); // Log to Excel once
    } else {
      if (!Array.isArray(user.likedProperties)) {
        user.likedProperties = [];
        await user.save();
      }
    }

    res.json({
      name: user.name,
      phone: user.phone,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// ✅ Like a property
export const likeProperty = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { propertyId } = req.params;

    const user = await User.findOne({ uid: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.likedProperties.includes(propertyId)) {
      user.likedProperties.push(propertyId);
      await user.save();
    }

    res.status(200).json({ success: true, likedProperties: user.likedProperties });
  } catch (err) {
    console.error('Like error:', err);
    res.status(500).json({ error: 'Failed to like property' });
  }
};

// ✅ Unlike a property
export const unlikeProperty = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { propertyId } = req.params;

    const user = await User.findOne({ uid: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.likedProperties = user.likedProperties.filter(
      (id) => id.toString() !== propertyId
    );
    await user.save();

    res.status(200).json({ success: true, likedProperties: user.likedProperties });
  } catch (err) {
    console.error('Unlike error:', err);
    res.status(500).json({ error: 'Failed to unlike property' });
  }
};
// ✅ Get liked properties
export const getLikedProperties = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('likedProperties');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Ensure response is always an array
    res.json(Array.isArray(user.likedProperties) ? user.likedProperties : []);
  } catch (err) {
    console.error('Error fetching liked properties:', err);
    res.status(500).json({ message: 'Server error' });
  }
};      
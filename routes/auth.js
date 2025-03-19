const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Google OAuth authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback with redirection
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Google authentication failed' });
    }

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Redirect user to frontend with token as a query parameter
    res.redirect(`${process.env.FRONTEND_MAIN_SCREEN_URL}?token=${token}`);
  }
);

module.exports = router;

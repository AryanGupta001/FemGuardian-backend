const SOSAlert = require('../models/SOSAlert');
const User = require('../models/User');
const sendSMS = require('../utils/sendSMS');

exports.triggerSOS = async (req, res) => {
  try {
    const { latitude, longitude, triggerReason } = req.body;
    const userId = req.user.id;

    // Find user profile
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Save the SOS alert in the database
    const newAlert = new SOSAlert({
      user: userId,
      latitude,
      longitude,
      triggerReason,
    });

    await newAlert.save();

    // Prepare SMS message
    const message = `🚨 SOS Alert!\nUser: ${user.username}\nLocation: ${latitude}, ${longitude}\nReason: ${triggerReason}\nPlease check on them!`;

    // Extract emergency contact numbers
    const emergencyContacts = user.emergencyContacts.map((contact) => contact.phone);

    if (emergencyContacts.length > 0) {
      // Send SMS to emergency contacts
      await sendSMS(emergencyContacts, message);
    }

    res.status(200).json({ message: 'SOS alert triggered and SMS sent.', alert: newAlert });
  } catch (error) {
    res.status(500).json({ message: 'Error triggering SOS alert', error: error.message });
  }
};

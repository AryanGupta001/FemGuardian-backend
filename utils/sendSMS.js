// utils/sendSMS.js
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Send SMS to a list of phone numbers
 * @param {string[]} phoneNumbers - Array of phone numbers to send the message to
 * @param {string} message - Message to send
 */
const sendSMS = async (phoneNumbers, message) => {
  try {
    const promises = phoneNumbers.map((number) =>
      client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: number,
      })
    );

    await Promise.all(promises);
    console.log('SMS sent successfully to all emergency contacts.');
  } catch (error) {
    console.error('Error sending SMS:', error.message);
  }
};

module.exports = sendSMS;

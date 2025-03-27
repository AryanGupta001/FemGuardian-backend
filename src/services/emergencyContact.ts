import * as admin from 'firebase-admin';
import twilio from 'twilio';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export class EmergencyContactService {
  private db: admin.firestore.Firestore;

  constructor() {
    this.db = admin.firestore();
  }

  async getEmergencyContacts(userId: string) {
    try {
      const userDoc = await this.db
        .collection('users')
        .doc(userId)
        .get();

      if (!userDoc.exists) {
        throw new AppError(404, 'User not found');
      }

      const userData = userDoc.data();
      const contacts = userData?.emergencyContacts || [];

      if (!contacts.length) {
        throw new AppError(404, 'No emergency contacts found');
      }

      return contacts;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error fetching emergency contacts:', error);
      throw new AppError(500, 'Failed to fetch emergency contacts');
    }
  }

  async sendEmergencySMS(
    contacts: Array<{ name: string; phone: string }>,
    message: string
  ) {
    try {
      const sendPromises = contacts.map(async contact => {
        try {
          const result = await twilioClient.messages.create({
            body: message,
            to: contact.phone,
            from: process.env.TWILIO_PHONE_NUMBER
          });
          
          logger.info({
            message: 'SMS sent successfully',
            contactPhone: contact.phone,
            messageId: result.sid
          });

          return result;
        } catch (error) {
          logger.error({
            message: 'Failed to send SMS',
            contactPhone: contact.phone,
            error: error
          });
          throw new AppError(500, `Failed to send SMS to ${contact.phone}`);
        }
      });

      return Promise.all(sendPromises);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error sending emergency SMS:', error);
      throw new AppError(500, 'Failed to send emergency alerts');
    }
  }
} 
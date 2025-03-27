import { Router, Response, RequestHandler } from 'express';
import { AuthRequest } from '../middleware/auth';
import { EmergencyContactService } from '../services/emergencyContact';

const router = Router();
const emergencyService = new EmergencyContactService();

const sendEmergencyAlert: RequestHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { message } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Get emergency contacts from Firestore
    const contacts = await emergencyService.getEmergencyContacts(req.user.uid);
    
    if (!contacts.length) {
      res.status(404).json({ error: 'No emergency contacts found' });
      return;
    }

    // Send SMS to all emergency contacts
    await emergencyService.sendEmergencySMS(contacts, message);

    res.json({ success: true, message: 'Emergency alerts sent successfully' });
  } catch (error) {
    console.error('Error sending emergency alerts:', error);
    res.status(500).json({ error: 'Failed to send emergency alerts' });
  }
};

router.post('/send-emergency-alert', sendEmergencyAlert);

export default router; 
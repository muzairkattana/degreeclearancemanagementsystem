import express from 'express';
import { processChatMessage } from '../services/ai.service.js';

const router = express.Router();

// Allow public access so students, applicants, and visitors can ask questions before and after login
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const response = await processChatMessage(message);
    return res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process AI query.' });
  }
});

export default router;

import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { processChatMessage } from '../services/ai.service.js';

const router = express.Router();

router.post('/chat', protect, async (req, res) => {
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

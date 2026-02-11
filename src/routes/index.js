import express from 'express';
import { processOrderTags } from '../controllers/tagController.js';

const router = express.Router();

// POST endpoint to trigger the sync manually or via webhook
router.post('/sync-tags', processOrderTags);

export default router;
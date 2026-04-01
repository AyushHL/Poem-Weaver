import { Router } from 'express';
import { asyncHandler } from '../middleware/index.js';
import {
  generatePoem,
  getRecentPoems,
  getModelStatus,
} from '../controllers/poemController.js';

const router = Router();

router.post('/generate', asyncHandler(generatePoem));
router.get('/recent', asyncHandler(getRecentPoems));
router.get('/model-status', asyncHandler(getModelStatus));

export default router;

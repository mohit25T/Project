import express from 'express';
import { generatePollWithCohere, getAllPolls, votePoll, getPollResults } from '../controllers/coherePollController.js';

const router = express.Router();
router.post('/generate', generatePollWithCohere);
router.post('/vote/:pollId', votePoll);
router.get('/', getAllPolls);
router.get('/results/:pollId', getPollResults);



export default router;

import express from 'express';
import { getPages, createPage, updatePage, deletePage } from '../controllers/pageController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getPages);
router.post('/', auth, createPage);
router.patch('/:id', auth, updatePage);
router.delete('/:id', auth, deletePage);

export default router; 
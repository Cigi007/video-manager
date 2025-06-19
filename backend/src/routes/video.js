import express from 'express';
import multer from 'multer';
import path from 'path';
import { getVideos, uploadVideos, updateVideo, deleteVideo } from '../controllers/videoController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

const UPLOAD_DIR = path.resolve('uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.get('/', auth, getVideos);
router.post('/', auth, upload.array('videos'), uploadVideos);
router.patch('/:id', auth, updateVideo);
router.delete('/:id', auth, deleteVideo);

export default router; 
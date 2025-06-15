import Video from '../models/Video.js';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.resolve('uploads');

export const getVideos = async (req, res) => {
  try {
    const videos = await Video.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'DESC']] });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Chyba při načítání videí.' });
  }
};

export const uploadVideos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nebyl nahrán žádný soubor.' });
    }
    const savedVideos = [];
    for (const file of req.files) {
      const video = await Video.create({
        userId: req.user.id,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        title: file.originalname,
      });
      savedVideos.push(video);
    }
    res.status(201).json(savedVideos);
  } catch (error) {
    res.status(500).json({ error: 'Chyba při ukládání videa.' });
  }
};

export const renameVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const video = await Video.findOne({ where: { id, userId: req.user.id } });
    if (!video) return res.status(404).json({ error: 'Video nenalezeno.' });
    video.title = title;
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Chyba při přejmenování videa.' });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findOne({ where: { id, userId: req.user.id } });
    if (!video) return res.status(404).json({ error: 'Video nenalezeno.' });
    const filePath = path.join(UPLOAD_DIR, video.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await video.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Chyba při mazání videa.' });
  }
}; 
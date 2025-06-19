import Video from '../models/Video.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import User from '../models/User.js';
import Page from '../models/Page.js';

const UPLOAD_DIR = path.resolve('uploads');
const ADMIN_EMAIL = 'admin@example.com';

// Pomocná funkce pro získání admin ID
async function getAdminId() {
  const admin = await User.findOne({ where: { email: ADMIN_EMAIL } });
  return admin ? admin.id : null;
}

export const getVideos = async (req, res) => {
  try {
    const videos = await Video.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: {
        model: Page,
        as: 'Pages',
        through: { attributes: [] },
        attributes: ['id', 'name', 'url'],
      },
      attributes: ['id', 'userId', 'filename', 'originalName', 'size', 'mimetype', 'title', 'thumbnail', 'duration', 'createdAt', 'updatedAt'],
    });
    console.log('Backend - getVideos returning:', JSON.stringify(videos, null, 2));
    res.json(videos);
  } catch (error) {
    console.error('Chyba při načítání videí:', error);
    res.status(500).json({ error: 'Chyba při načítání videí.', detail: error.message, stack: error.stack });
  }
};

export const uploadVideos = async (req, res) => {
  try {
    if (!req.user || !req.user.id) return res.status(401).json({ error: 'Uživatel není přihlášen.' });
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nebyl nahrán žádný soubor.' });
    }
    const savedVideos = [];
    for (const file of req.files) {
      const videoPath = path.join(UPLOAD_DIR, file.filename);
      const thumbFilename = file.filename.replace(path.extname(file.filename), '.jpg');
      const thumbPath = path.join(UPLOAD_DIR, 'thumbnails', thumbFilename);
      
      // Get video duration using ffprobe
      let duration = null;
      try {
        const durationOutput = await new Promise((resolve, reject) => {
          exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`, (err, stdout) => {
            if (err) reject(err);
            else resolve(stdout);
          });
        });
        duration = Math.round(parseFloat(durationOutput));
      } catch (err) {
        console.error('Chyba při získávání délky videa:', err);
        throw err;
      }

      // Vygeneruj thumbnail pomocí ffmpeg (první snímek)
      try {
        await new Promise((resolve, reject) => {
          exec(`ffmpeg -y -i "${videoPath}" -ss 00:00:01.000 -vframes 1 "${thumbPath}"`, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      } catch (err) {
        console.error('Chyba při generování thumbnailu:', err);
        throw err;
      }

      const video = await Video.create({
        userId: req.user.id,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        title: file.originalname,
        thumbnail: `http://localhost:3000/uploads/thumbnails/${thumbFilename}`,
        duration: duration,
      });
      savedVideos.push(video);
    }
    res.status(201).json(savedVideos);
  } catch (error) {
    console.error('Chyba při ukládání videa:', error);
    res.status(500).json({ error: 'Chyba při ukládání videa.', detail: error.message, stack: error.stack });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, connectedPageIds } = req.body;
    const video = await Video.findOne({ where: { id, userId: req.user.id } });
    if (!video) return res.status(404).json({ error: 'Video nenalezeno.' });

    if (title !== undefined) {
      video.title = title;
    }
    
    if (connectedPageIds !== undefined && Array.isArray(connectedPageIds)) {
      const pages = await Page.findAll({ where: { id: connectedPageIds, userId: req.user.id } });
      await video.setPages(pages);
    }

    console.log('Backend - updateVideo saving:', video.toJSON());
    await video.save();
    
    const updatedVideo = await Video.findByPk(id, {
      include: {
        model: Page,
        as: 'Pages',
        through: { attributes: [] },
        attributes: ['id', 'name', 'url'],
      },
    });
    
    res.json(updatedVideo);
  } catch (error) {
    console.error('Chyba při aktualizaci videa:', error);
    res.status(500).json({ error: 'Chyba při aktualizaci videa.', detail: error.message, stack: error.stack });
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
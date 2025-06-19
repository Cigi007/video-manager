import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/video.js';
import fs from 'fs';
import path from 'path';
import pageRoutes from './routes/page.js';
import './models/associations.js';

const app = express();
const port = process.env.PORT || 3000;

// Zajistím, že složka uploads existuje
const UPLOAD_DIR = path.resolve('uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}
const THUMB_DIR = path.join(UPLOAD_DIR, 'thumbnails');
if (!fs.existsSync(THUMB_DIR)) {
  fs.mkdirSync(THUMB_DIR);
}

app.use(cors({
  origin: [
    'https://video-manager-ten.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/pages', pageRoutes);
app.use('/uploads', express.static(UPLOAD_DIR));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Něco se pokazilo!' });
});

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Databázové připojení bylo úspěšné.');
    // Před synchronizací modelů, zahoďte tabulku VideoViews a Videos, pokud existují, kvůli změně typu sloupce
    await sequelize.query('DROP TABLE IF EXISTS "VideoViews" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "VideoPage" CASCADE;');
    await sequelize.query('DROP TABLE IF EXISTS "Videos" CASCADE;');
    
    // Dočasně použijte force: true pro vynucení resetu schématu databáze
    // To smaže všechna data v tabulkách!
    await sequelize.sync({ alter: true });
    console.log('Databázové modely byly synchronizovány.');

    app.listen(port, () => {
      console.log(`Server běží na portu ${port}`);
    });
  } catch (error) {
    console.error('Nepodařilo se připojit k databázi:', error);
  }
};

startServer(); 
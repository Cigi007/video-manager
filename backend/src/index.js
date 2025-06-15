import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/video.js';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Zajistím, že složka uploads existuje
const UPLOAD_DIR = path.resolve('uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
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
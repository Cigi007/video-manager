import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.resolve(__dirname, '..', '..', '.env');
console.log('Attempting to load .env from:', envPath);
dotenv.config({ path: envPath });

console.log('DB_NAME from database.js (after dotenv.config()):', process.env.DB_NAME);
console.log('DB_USER from database.js (after dotenv.config()):', process.env.DB_USER);
console.log('DB_HOST from database.js (after dotenv.config()):', process.env.DB_HOST);
console.log('DB_PORT from database.js (after dotenv.config()):', process.env.DB_PORT);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    protocol: 'postgres',
    logging: console.log,
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {}
  }
);

export default sequelize;
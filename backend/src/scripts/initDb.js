import sequelize from '../config/database.js';
import User from '../models/User.js';
import Video from '../models/Video.js';
import Page from '../models/Page.js';
import VideoMetric from '../models/VideoMetric.js';
import ActivityLog from '../models/ActivityLog.js';
import '../models/associations.js';

const createAdminUser = async () => {
  try {
    // Synchronizace databáze - { force: true } smaže existující tabulky a vytvoří nové.
    // Používat opatrně! Pro produkci se obvykle používají migrace.
    await sequelize.sync({ force: true });
    console.log('Databáze byla úspěšně inicializována a synchronizována.');

    // Vytvoření admin účtu (hashuje Sequelize hook s argon2)
    await User.findOrCreate({
      where: { email: 'admin@example.com' },
      defaults: {
        id: 'admin-auth0-user-id',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true
      }
    });

    console.log('Admin účet byl úspěšně vytvořen nebo nalezen.');
    console.log('Email: admin@example.com');
    console.log('Heslo: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Chyba při inicializaci databáze:', error);
    process.exit(1);
  }
};

createAdminUser(); 
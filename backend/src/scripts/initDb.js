import sequelize from '../config/database.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const createAdminUser = async () => {
  try {
    // Synchronizace databáze
    await sequelize.sync({ force: true });
    console.log('Databáze byla úspěšně inicializována.');

    // Vytvoření admin účtu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true
    });

    console.log('Admin účet byl úspěšně vytvořen.');
    console.log('Email: admin@example.com');
    console.log('Heslo: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Chyba při inicializaci databáze:', error);
    process.exit(1);
  }
};

createAdminUser(); 
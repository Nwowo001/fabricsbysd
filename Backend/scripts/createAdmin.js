import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const existingAdmin = await User.findOne({ email: 'sarah@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const admin = await User.create({
      name: 'Sarah Admin',
      email: 'sarah@gmail.com',
      password: 'sarah123',
      role: 'admin',
      isEmailVerified: true
    });

    console.log('Admin user created successfully:', admin.email);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();
import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Set up PostgreSQL connection pool and Prisma adapter
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const register = async (req, res) => {
  try {
    const { fullName, username, password, role } = req.body;

    // Validate required fields
    if (!fullName || !username || !password || !role) {
      return res.status(400).json({ message: 'All fields are required (fullName, username, password, role)' });
    }

    // Validate role
    const validRoles = ['ADMIN', 'DOCTOR', 'PHARMACIST', 'OPTICIAN'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
        role,
      },
    });

    // Return user details (excluding password)
    const { password: _, ...userDetails } = user;

    res.status(201).json({
      message: 'User registered successfully',
      user: userDetails,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const login = async (req, res) => {
  console.log('Login attempt:', { ...req.body, password: '***' });
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });
    console.log('User found:', user ? user.username : 'null');

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    console.log('Verifying password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check secret
    if (!process.env.JWT_SECRET) {
      console.error('FATAL: JWT_SECRET is missing!');
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Generate JWT token
    console.log('Generating token...');
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    console.log('Token generated successfully');

    // Return token and user details (excluding password)
    const { password: _, ...userDetails } = user;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userDetails,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

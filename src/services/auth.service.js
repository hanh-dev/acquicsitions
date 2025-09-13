import bcrypt from 'bcrypt';
import logger from '#config/logger.js';
import { User } from '#models/user.model.js';
import { db } from '#config/database.js';
import { eq } from 'drizzle-orm';
export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    logger.error('Error hashing password:', error);
    throw new Error('Error hashing password');
  }
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    logger.error('Error comparing password:', error);
    throw new Error('Error verifying password');
  }
};

export const findUserByEmail = async (email) => {
  try {
    const [user] = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .limit(1);
    return user || null;
  } catch (error) {
    logger.error('Error finding user:', error);
    throw new Error('Error finding user');
  }
};

export const createNewUser = async ({ name, email, password, role }) => {
  try {
    const existingUser = await db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .limit(1);

    if (existingUser.length > 0)
      throw new Error('User with this email already exists');
    const hashedPassword = await hashPassword(password);
    const [newUser] = await db
      .insert(User)
      .values({ name, email, password: hashedPassword, role })
      .returning({ id: User.id, email: User.email, role: User.role });
    logger.info(`New user created with ID: ${newUser.id}`);
    return newUser;
  } catch (error) {
    logger.error('Error creating user:', error);
    throw new Error('Error creating user');
  }
};

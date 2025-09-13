import logger from '#config/logger.js';
import jwt from 'jsonwebtoken';
import pkg from 'jsonwebtoken';
const { verify } = pkg;

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = '1d';

export const jwtToken = {
  sign: (payload) => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      logger.error('Error signing JWT:', error);
      throw error;
    }
  },
  verify: (token) => {
    try {
      return verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('Error verifying JWT:', error);
      throw error;
    }
  },
};

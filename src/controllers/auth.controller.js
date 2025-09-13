import logger from '#config/logger.js';
import { signupSchema, signinSchema } from '../validation/auth.validation.js';
import { formatValidationErrors } from '#utils/format.js';
import {
  createNewUser,
  findUserByEmail,
  comparePassword,
} from '#services/auth.service.js';
import { jwtToken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';
export const signup = async (req, res) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (validationResult.error) {
      return res.status(400).send({
        error: 'Validation error',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;
    const user = await createNewUser({ name, email, password, role });
    const token = jwtToken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);
    res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    logger.error('Signup error:', error);

    if (error.name === 'User with this email already exists') {
      return res.status(409).send({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const signin = async (req, res) => {
  try {
    const validationResult = signinSchema.safeParse(req.body);
    if (validationResult.error) {
      return res.status(400).json({
        error: 'Validation error',
        details: formatValidationErrors(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwtToken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    const { password: _, ...userResponse } = user;

    res.status(200).json({
      message: 'User signed in successfully',
      user: userResponse,
    });
  } catch (error) {
    logger.error('Signin error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req, res) => {
  try {
    cookies.clear(res, 'token');

    res.status(200).json({
      message: 'User signed out successfully',
    });
  } catch (error) {
    logger.error('Logout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

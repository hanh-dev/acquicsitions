import logger from '#config/logger.js';
import { signupSchema } from '../validation/auth.validation.js';
import { formatValidationErrors } from '#utils/format.js';
import { createNewUser } from '#services/auth.service.js';
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
  }
};

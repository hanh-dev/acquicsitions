import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user ? req.user.role : 'user';
    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20;
        message = 'Too Many Requests - Admin limit exceeded';
        break;
      case 'user':
        limit = 10;
        message = 'Too Many Requests - User limit exceeded';
        break;
      case 'guest':
        limit = 5;
        message = 'Too Many Requests - Guest limit exceeded';
        break;
    }

    const client = aj.withRule(
      slidingWindow({ mode: 'LIVE', interval: 60, limit, max: 5 }),
    );

    const decision = await client.protect(req, { requested: 1 });
    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn(`Request denied: ${decision.reason.toString()}`);
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Automated requests are not allowed',
      });
    }
    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn(`Sheild blocked requests: ${decision.reason.toString()}`);
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Requests blocked by security policy',
      });
    }
    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn(`Rate limit exceed: ${decision.reason.toString()}`);
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Too many requests',
      });
    }
    next();
  } catch (error) {
    logger.error('Security middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default securityMiddleware;

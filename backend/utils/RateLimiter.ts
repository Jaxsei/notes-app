import rateLimit from 'express-rate-limit';

const RateLimiter = (maxRequests: number = 20) =>
  rateLimit({
    windowMs: 10 * 60 * 1000, // 15 minutes
    max: maxRequests,
    message: { error: 'Too many requests, please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
  });

export { RateLimiter };

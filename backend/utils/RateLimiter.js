import rateLimit from 'express-rate-limit';

const RateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, Please slow down' },
  standardHeaders: true,
  legacyHeaders: false
});

export { RateLimiter }

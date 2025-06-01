import rateLimit from 'express-rate-limit';
// Limit note creation and updates to prevent spam
const noteLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20, // Allow 20 requests per 10 minutes per IP
    message: { error: 'Too many requests, please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Limit fetching notes separately (usually needs a higher limit)
const getNotesLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50, // Allow 50 fetch requests per 10 minutes
    message: { error: 'Too many requests, please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
});
export { noteLimiter, getNotesLimiter };
//# sourceMappingURL=NotesRateLimiter.js.map
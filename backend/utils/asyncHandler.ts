import { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler =
  <T extends RequestHandler>(fn: T): RequestHandler =>
    (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };

export { asyncHandler };

import AppError from '@shared/errors/AppError';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const rateLimiter = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimit',
    points: 5,
    duration: 1,
  });

  try {
    await limiter.consume(request.ip);

    return next();
  } catch (error) {
    throw new AppError('Too many request', 429);
  }
};

export default rateLimiter;

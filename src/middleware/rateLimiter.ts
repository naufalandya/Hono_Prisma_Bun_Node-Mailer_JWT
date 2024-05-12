import { rateLimiter } from "hono-rate-limiter";

export const limiter = rateLimiter({
    windowMs: 1 * 60 * 1000,
    limit: 30,
    keyGenerator: (c) => "<unique_key>", 
});
  
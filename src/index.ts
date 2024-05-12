import { Hono } from "hono";
import { logger } from "hono/logger";
import { sentry } from "@hono/sentry";
import { trimTrailingSlash } from "hono/trailing-slash";
import { cors } from "hono/cors";
import { ws } from "@bit-js/bun-utils";
import { secureHeaders } from "hono/secure-headers";
import { myRateLimiter } from "./middleware";
import v1 from "./api/v1";
import { showRoutes } from "hono/dev";

const PORT = Number(Bun.env.PORT) || 5865
const app = new Hono()
    .use('/*', async (ctx, next) => {
        const corsMiddleware = cors({
            origin: 'http://localhost:5173',
            allowHeaders: ['Origin', 'Content-Type', 'Authorization'],
            allowMethods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
            credentials: true,
        })
        return await corsMiddleware(ctx, next)
    })
    .use(myRateLimiter.limiter)
    .use('*', sentry({ dsn : Bun.env.DSN}))
    .use(logger(), trimTrailingSlash(), secureHeaders())
    .get("/", (ctx) => {
        return ctx.json({
            message : "Hello World"
        }) 
    })
    .route("/api", v1)
    .notFound((ctx) => {
        return ctx.json({
            status : false,
            message : "api is not found"
        }, 404)
    })
    .onError((error, ctx) => {
        return ctx.json(
            { error: { statusCode: 500, name: error.name, message: error.message } || 'Internal Server Error' },
        )
    })
showRoutes(app)
ws.serve({
    server: {
        fetch: app.fetch,
        port: PORT
    }
});
    
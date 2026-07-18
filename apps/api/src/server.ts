import Fastify from "fastify";
import cors from "@fastify/cors";
import redisPlugin from "./plugins/redis.js";
import prismaPlugin from "./plugins/prisma.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import marketRoutes from "./modules/market/market.routes.js";
import walletRoutes from "./modules/wallet/wallet.routes.js";
import meRoutes from "./modules/me/me.routes.js";

const fastify = Fastify({ logger: true });

await fastify.register(cors, {
  origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
  credentials: true,
});
await fastify.register(prismaPlugin);
await fastify.register(redisPlugin);
await fastify.register(healthRoutes, { prefix: "/v1/health" });
await fastify.register(walletRoutes);
await fastify.register(marketRoutes);
await fastify.register(meRoutes);

const PORT = Number(process.env.PORT) || 3333;

fastify.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
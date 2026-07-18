import fp from "fastify-plugin";
import { Redis } from "ioredis";
import type { FastifyInstance } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    redis: Redis;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

  redis.on("error", (err: Error) => {
    fastify.log.error({ err }, "Redis connection error");
  });

  fastify.decorate("redis", redis);

  fastify.addHook("onClose", async (instance) => {
    await instance.redis.quit();
  });
});

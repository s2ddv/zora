import cors from "@fastify/cors";
import Fastify from "fastify";
import { healthRoutes } from "./modules/health/health.routes.js";

export function buildApp() {
  const app = Fastify({
    logger: {
      transport:
        process.env.NODE_ENV === "development"
          ? { target: "pino-pretty" }
          : undefined,
    },
  });

  void app.register(cors, {
    origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
    credentials: true,
  });

  void app.register(healthRoutes, { prefix: "/v1/health" });

  return app;
}

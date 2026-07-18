import type { FastifyReply, FastifyRequest } from "fastify";
import { UserRepository } from "../repositories/user.repository.js";

declare module "fastify" {
  interface FastifyRequest {
    userId: string | null;
  }
}

export async function requireUserId(
  request: FastifyRequest,
  reply: FastifyReply,
  userRepo: UserRepository
): Promise<string | null> {
  const header = request.headers["x-user-id"];
  if (typeof header === "string" && header.length > 0) {
    const user = await userRepo.findById(header);
    if (!user) {
      reply.status(401).send({ error: "Invalid X-User-Id header" });
      return null;
    }
    request.userId = user.id;
    return user.id;
  }

  const devUserId = process.env.DEV_USER_ID;
  if (devUserId) {
    const user = await userRepo.findById(devUserId);
    if (user) {
      request.userId = user.id;
      return user.id;
    }
  }

  reply.status(401).send({
    error: "Authentication required",
    hint: "Set X-User-Id header or DEV_USER_ID in .env (run db:seed first)",
  });
  return null;
}

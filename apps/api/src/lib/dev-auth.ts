import type { FastifyReply, FastifyRequest } from "fastify";
import { UserRepository } from "../repositories/user.repository.js";

declare module "fastify" {
  interface FastifyRequest {
    userId: string | null;
  }
}

/**
 * @deprecated Use the auth plugin (plugins/auth.ts) instead.
 * This function is kept for legacy support during migration to Supabase Auth.
 * It will be removed in Phase 3 final cleanup.
 */
export async function requireUserId(
  request: FastifyRequest,
  reply: FastifyReply,
  userRepo: UserRepository
): Promise<string | null> {
  // If auth plugin already set userId, just return it
  if (request.userId) {
    return request.userId;
  }

  // Legacy fallback for X-User-Id header
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

  // Legacy fallback for DEV_USER_ID env variable
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
    hint: "Use Bearer token in Authorization header or set DEV_USER_ID in .env",
  });
  return null;
}

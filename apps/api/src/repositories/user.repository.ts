import type { PrismaClient } from "@kryptonik/database";

export class UserRepository {
  constructor(private readonly db: PrismaClient) {}

  findById(id: string) {
    return this.db.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.db.user.findUnique({ where: { email } });
  }

  findByAuthId(authId: string) {
    return this.db.user.findUnique({ where: { authId } });
  }
}

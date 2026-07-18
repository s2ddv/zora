import type { PrismaClient } from "@kryptonik/database";

export class PortfolioSnapshotRepository {
  constructor(private readonly db: PrismaClient) {}

  findByUserId(userId: string, limit = 30) {
    return this.db.portfolioSnapshot.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  create(userId: string, totalUsd: number) {
    return this.db.portfolioSnapshot.create({
      data: { userId, totalUsd },
    });
  }
}

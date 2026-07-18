import type { FastifyInstance } from "fastify";
import { PortfolioSnapshotRepository } from "../../repositories/portfolio-snapshot.repository.js";
import { toPortfolioSnapshotDto } from "../../lib/mappers.js";

export class MePortfolioService {
  private readonly snapshotRepo: PortfolioSnapshotRepository;

  constructor(fastify: FastifyInstance) {
    this.snapshotRepo = new PortfolioSnapshotRepository(fastify.prisma);
  }

  async listSnapshots(userId: string, limit: number) {
    const snapshots = await this.snapshotRepo.findByUserId(userId, limit);
    return snapshots.map(toPortfolioSnapshotDto);
  }

  async createSnapshot(userId: string, totalUsd: number) {
    const snapshot = await this.snapshotRepo.create(userId, totalUsd);
    return toPortfolioSnapshotDto(snapshot);
  }
}

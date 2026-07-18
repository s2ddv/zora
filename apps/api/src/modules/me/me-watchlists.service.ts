import type { FastifyInstance } from "fastify";
import { WatchlistRepository } from "../../repositories/watchlist.repository.js";
import { toWatchlistItemDto } from "../../lib/mappers.js";

export class MeWatchlistsService {
  private readonly watchlistRepo: WatchlistRepository;

  constructor(fastify: FastifyInstance) {
    this.watchlistRepo = new WatchlistRepository(fastify.prisma);
  }

  async list(userId: string) {
    const items = await this.watchlistRepo.findByUserId(userId);
    return items.map(toWatchlistItemDto);
  }

  async add(userId: string, coinId: string) {
    const item = await this.watchlistRepo.create(userId, coinId);
    return toWatchlistItemDto(item);
  }

  async remove(userId: string, coinId: string) {
    const result = await this.watchlistRepo.delete(userId, coinId);
    return result.count > 0;
  }
}

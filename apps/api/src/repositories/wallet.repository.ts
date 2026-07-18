import type { Chain, PrismaClient } from "@kryptonik/database";

export interface CreateWalletData {
  address: string;
  chain: Chain;
  nickname?: string | undefined;
  userId: string;
}

export class WalletRepository {
  constructor(private readonly db: PrismaClient) {}

  findByUserId(userId: string) {
    return this.db.wallet.findMany({
      where: { userId },
      include: { assets: true },
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id: string) {
    return this.db.wallet.findUnique({
      where: { id },
      include: { assets: true },
    });
  }

  findByIdForUser(id: string, userId: string) {
    return this.db.wallet.findFirst({
      where: { id, userId },
      include: { assets: true },
    });
  }

  create(data: CreateWalletData) {
    return this.db.wallet.create({
      data: {
        address: data.address,
        chain: data.chain,
        nickname: data.nickname ?? null,
        userId: data.userId,
      },
      include: { assets: true },
    });
  }

  delete(id: string, userId: string) {
    return this.db.wallet.deleteMany({
      where: { id, userId },
    });
  }

  upsertAsset(walletId: string, symbol: string, amount: string) {
    return this.db.walletAsset.upsert({
      where: {
        walletId_symbol: { walletId, symbol },
      },
      update: { amount },
      create: { walletId, symbol, amount },
    });
  }
}

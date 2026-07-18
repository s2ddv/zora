import { prisma } from "../src/index.js";

const DEMO_USER = {
  id: "demo_user_zora",
  email: "demo@zora.app",
  name: "Demo User",
  externalId: "demo_external_auth",
};

const DEMO_WALLET = {
  address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  chain: "ETHEREUM" as const,
  nickname: "Main Wallet",
};

async function main() {
  const user = await prisma.user.upsert({
    where: { id: DEMO_USER.id },
    update: { name: DEMO_USER.name },
    create: DEMO_USER,
  });

  await prisma.wallet.upsert({
    where: {
      userId_address_chain: {
        userId: user.id,
        address: DEMO_WALLET.address,
        chain: DEMO_WALLET.chain,
      },
    },
    update: { nickname: DEMO_WALLET.nickname },
    create: {
      ...DEMO_WALLET,
      userId: user.id,
    },
  });

  await prisma.watchlist.upsert({
    where: {
      userId_coinId: { userId: user.id, coinId: "bitcoin" },
    },
    update: {},
    create: { userId: user.id, coinId: "bitcoin" },
  });

  await prisma.watchlist.upsert({
    where: {
      userId_coinId: { userId: user.id, coinId: "ethereum" },
    },
    update: {},
    create: { userId: user.id, coinId: "ethereum" },
  });

  await prisma.portfolioSnapshot.create({
    data: {
      userId: user.id,
      totalUsd: 12500.0,
    },
  });

  console.log("Seed completed.");
  console.log(`Demo user id: ${user.id}`);
  console.log(`Set DEV_USER_ID=${user.id} in your .env file`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

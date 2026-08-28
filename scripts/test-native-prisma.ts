import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("=== Testing Native Prisma Client ===");
    const users = await prisma.user.findMany();
    console.log("✅ Successfully connected! User count:", users.length);
  } catch (error) {
    console.error("❌ Native Prisma Client failed to connect:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

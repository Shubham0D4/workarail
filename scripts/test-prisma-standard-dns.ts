import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("=== Testing Prisma standard DNS ===");
    const users = await prisma.user.findMany();
    console.log("✅ Successfully connected! User count:", users.length);
  } catch (error) {
    console.error("❌ Standard Prisma failed to connect:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();

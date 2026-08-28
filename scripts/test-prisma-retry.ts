import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;

function wrapPool(pool: any) {
  const originalQuery = pool.query;
  pool.query = async function (this: any, ...args: any[]) {
    let attempts = 3;
    while (attempts > 0) {
      try {
        return await originalQuery.apply(this, args);
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        const isConnectionLoss = 
          errMsg.includes("closed the connection") ||
          errMsg.includes("Connection terminated") ||
          errMsg.includes("connection closed") ||
          err?.code === "P1017" ||
          err?.code === "ETIMEDOUT";

        if (isConnectionLoss && attempts > 1) {
          console.warn(`Database query failed, retrying (${attempts - 1} left):`, errMsg);
          attempts--;
          // Wait 200ms before retrying to let the pool rebuild the connection
          await new Promise(resolve => setTimeout(resolve, 200));
          continue;
        }
        throw err;
      }
    }
  };
  return pool;
}

async function main() {
  const pool = wrapPool(
    new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
  );

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("=== Testing Prisma Retry & SSL Settings ===");
    for (let i = 0; i < 5; i++) {
      const users = await prisma.user.findMany();
      console.log(`[Run ${i + 1}] Successfully connected! User count:`, users.length);
      // Wait 1 second between queries
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error("❌ Prisma connection failed:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();

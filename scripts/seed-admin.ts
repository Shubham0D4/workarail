import "dotenv/config";
import pg from "pg";
import crypto from "crypto";

const { Pool } = pg;

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });

  try {
    const client = await pool.connect();
    console.log("Connected to database. Seeding admin user...");

    // Clean up existing admin if present to avoid conflicts
    await client.query(
      `DELETE FROM "Account" WHERE "userId" IN (SELECT id FROM "User" WHERE email = $1)`,
      ["shubhamd@tvita.in"]
    );
    await client.query(
      `DELETE FROM "User" WHERE email = $1`,
      ["shubhamd@tvita.in"]
    );

    const userId = crypto.randomUUID();
    const accountId = crypto.randomUUID();
    const hashedPassword = hashPassword("Pass1234");
    const now = new Date();

    // 1. Insert into User
    await client.query(
      `INSERT INTO "User" (
        "id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, "Shubham D", "shubhamd@tvita.in", true, null, now, now]
    );
    console.log("✅ Inserted user into 'User' table.");

    // 2. Insert into Account
    await client.query(
      `INSERT INTO "Account" (
        "id", "accountId", "providerId", "userId", "password", "issuer", "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [accountId, userId, "credential", userId, hashedPassword, "local:credential", now, now]
    );
    console.log("✅ Inserted credential account into 'Account' table.");

    console.log("🎉 Seed finished successfully!");
    client.release();
  } catch (error) {
    console.error("❌ Failed to seed admin user:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();

import { prisma } from "../app/lib/prisma.js";

async function main() {
  try {
    // Run one read
    await prisma.user.findMany();
    console.log("✅ Connected");
  } catch (error) {
    console.error("❌ Failed to connect:");
    console.dir(error, { depth: null });
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

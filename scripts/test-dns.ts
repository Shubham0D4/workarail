import { prisma } from "../app/lib/prisma";

async function main() {
  try {
    console.log("Fetching staff counts...");
    const count = await prisma.staff.count();
    console.log("Total staff records in database:", count);
  } catch (error) {
    console.error("Error querying database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

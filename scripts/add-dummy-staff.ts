import { prisma } from "../app/lib/prisma";
import crypto from "crypto";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function main() {
  const email = "darekarshubham2005@gmail.com";
  const password = "Pass1234";
  const crewName = "dummy crew";

  try {
    console.log(`=== Cleaning up existing staff/user for ${email} ===`);

    // 1. Find existing Staff
    const existingStaff = await prisma.staff.findUnique({
      where: { email },
    });

    if (existingStaff) {
      const ref = existingStaff.ref;
      console.log(`Found existing staff member with ref ${ref}. Deleting related data...`);

      const dPayroll = await prisma.payrollRecord.deleteMany({ where: { staffRef: ref } });
      console.log(`Deleted ${dPayroll.count} payroll records.`);

      const dExpenses = await prisma.expense.deleteMany({ where: { staffRef: ref } });
      console.log(`Deleted ${dExpenses.count} expenses.`);

      const dLeaves = await prisma.leaveRequest.deleteMany({ where: { staffRef: ref } });
      console.log(`Deleted ${dLeaves.count} leave requests.`);

      const dAttendance = await prisma.attendance.deleteMany({ where: { staffRef: ref } });
      console.log(`Deleted ${dAttendance.count} attendance records.`);

      const dStaff = await prisma.staff.delete({ where: { ref } });
      console.log(`Deleted staff record: ${dStaff.name}`);
    }

    // 2. Find existing User
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`Found existing user with email ${email}. Deleting accounts and user...`);

      const dAccounts = await prisma.account.deleteMany({ where: { userId: existingUser.id } });
      console.log(`Deleted ${dAccounts.count} accounts.`);

      const dSessions = await prisma.session.deleteMany({ where: { userId: existingUser.id } });
      console.log(`Deleted ${dSessions.count} sessions.`);

      const dUser = await prisma.user.delete({ where: { id: existingUser.id } });
      console.log(`Deleted user: ${dUser.name}`);
    }

    console.log(`=== Adding crew and staff member ===`);

    // 3. Find or create Crew
    let crew = await prisma.crew.findUnique({
      where: { name: crewName },
    });

    if (!crew) {
      crew = await prisma.crew.create({
        data: { name: crewName },
      });
      console.log(`Created crew: ${crew.name}`);
    } else {
      console.log(`Using existing crew: ${crew.name}`);
    }

    // 4. Create User
    const userId = crypto.randomUUID();
    const now = new Date();
    const user = await prisma.user.create({
      data: {
        id: userId,
        email,
        name: "Dummy Staff",
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      },
    });
    console.log(`Created user record for ${email}`);

    // 5. Create Account
    const accountId = crypto.randomUUID();
    const hashedPassword = hashPassword(password);
    await prisma.account.create({
      data: {
        id: accountId,
        accountId: userId,
        providerId: "credential",
        userId,
        password: hashedPassword,
        issuer: "local:credential",
        createdAt: now,
        updatedAt: now,
      },
    });
    console.log(`Created credential account for user`);

    // 6. Create Staff
    const staffRef = `EMP-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const staff = await prisma.staff.create({
      data: {
        ref: staffRef,
        name: "Dummy Staff",
        email,
        phone: "+44 7700 900077",
        role: "Technician",
        crewId: crew.id,
        status: "available",
        joined: now,
        birthday: "01-01",
        userId,
      },
    });
    console.log(`Created staff record: ${staff.name} (${staff.ref})`);

    console.log("🎉 Seeding of dummy staff completed successfully!");
  } catch (error) {
    console.error("❌ Failed to add dummy staff:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

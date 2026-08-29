import { prisma } from "../app/lib/prisma";

async function main() {
  try {
    console.log("=== Clearing database except admin user (shubhamd@tvita.in) ===");

    // Delete dependent transaction/relationship records first
    const dPayroll = await prisma.payrollRecord.deleteMany();
    console.log(`Deleted ${dPayroll.count} payroll records.`);

    const dExpenses = await prisma.expense.deleteMany();
    console.log(`Deleted ${dExpenses.count} expenses.`);

    const dInvoices = await prisma.invoice.deleteMany();
    console.log(`Deleted ${dInvoices.count} invoices.`);

    const dLeaves = await prisma.leaveRequest.deleteMany();
    console.log(`Deleted ${dLeaves.count} leave requests.`);

    const dAttendance = await prisma.attendance.deleteMany();
    console.log(`Deleted ${dAttendance.count} attendance records.`);

    // Delete base models
    const dStaff = await prisma.staff.deleteMany();
    console.log(`Deleted ${dStaff.count} staff records.`);

    const dAttachments = await prisma.attachment.deleteMany();
    console.log(`Deleted ${dAttachments.count} attachments.`);

    const dJobs = await prisma.job.deleteMany();
    console.log(`Deleted ${dJobs.count} jobs.`);

    const dCrews = await prisma.crew.deleteMany();
    console.log(`Deleted ${dCrews.count} crews.`);

    const dClients = await prisma.client.deleteMany();
    console.log(`Deleted ${dClients.count} clients.`);

    // Delete active sessions & verifications
    const dSessions = await prisma.session.deleteMany();
    console.log(`Deleted ${dSessions.count} sessions.`);

    const dVerifications = await prisma.verification.deleteMany();
    console.log(`Deleted ${dVerifications.count} verifications.`);

    // Retain only the admin user "shubhamd@tvita.in" and their accounts
    const adminUser = await prisma.user.findUnique({
      where: { email: "shubhamd@tvita.in" },
    });

    if (adminUser) {
      const dAccounts = await prisma.account.deleteMany({
        where: {
          userId: {
            not: adminUser.id,
          },
        },
      });
      console.log(`Deleted ${dAccounts.count} other accounts.`);

      const dUsers = await prisma.user.deleteMany({
        where: {
          email: {
            not: "shubhamd@tvita.in",
          },
        },
      });
      console.log(`Deleted ${dUsers.count} other users.`);
    } else {
      console.log("⚠️ Admin user shubhamd@tvita.in not found. Deleting all users and accounts.");
      const dAccounts = await prisma.account.deleteMany();
      console.log(`Deleted ${dAccounts.count} accounts.`);
      const dUsers = await prisma.user.deleteMany();
      console.log(`Deleted ${dUsers.count} users.`);
    }

    console.log("=== Database clearing finished successfully! ===");
  } catch (error) {
    console.error("❌ Failed to clear database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

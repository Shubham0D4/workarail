import { prisma } from "../app/lib/prisma";

async function main() {
  try {
    console.log("=== Database Verification ===");
    console.log("User count:        ", await prisma.user.count());
    console.log("Crew count:        ", await prisma.crew.count());
    console.log("Job count:         ", await prisma.job.count());
    console.log("Staff count:       ", await prisma.staff.count());
    console.log("Attendance count:  ", await prisma.attendance.count());
    console.log("LeaveRequest count:", await prisma.leaveRequest.count());
    console.log("Attachment count:  ", await prisma.attachment.count());
    console.log("Client count:      ", await prisma.client.count());
    console.log("Invoice count:     ", await prisma.invoice.count());
    console.log("Expense count:     ", await prisma.expense.count());
    console.log("Payroll count:     ", await prisma.payrollRecord.count());
    console.log("=============================");
  } catch (error) {
    console.error("Database query failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

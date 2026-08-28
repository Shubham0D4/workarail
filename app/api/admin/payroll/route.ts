import { getSessionAndRole } from "@/app/lib/api-auth";
import { getPayrollRecords } from "@/app/actions/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { errorResponse, isStaff } = await getSessionAndRole();
  if (errorResponse) return errorResponse;

  if (isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const payroll = await getPayrollRecords();
    return NextResponse.json(payroll);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to retrieve payroll records" }, { status: 500 });
  }
}

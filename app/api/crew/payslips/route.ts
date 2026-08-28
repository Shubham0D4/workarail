import { getSessionAndRole } from "@/app/lib/api-auth";
import { getCrewSession } from "@/app/actions/crew";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { errorResponse, isStaff } = await getSessionAndRole();
  if (errorResponse) return errorResponse;

  if (!isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const me = await getCrewSession();
    const records = await prisma.payrollRecord.findMany({
      where: { staffRef: me.ref },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
    return NextResponse.json(records);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to retrieve payslips" }, { status: 500 });
  }
}

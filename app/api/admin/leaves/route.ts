import { getSessionAndRole } from "@/app/lib/api-auth";
import { getLeaveRequests } from "@/app/actions/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { errorResponse, isStaff } = await getSessionAndRole();
  if (errorResponse) return errorResponse;

  if (isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const leaves = await getLeaveRequests();
    return NextResponse.json(leaves);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to retrieve leave requests" }, { status: 500 });
  }
}

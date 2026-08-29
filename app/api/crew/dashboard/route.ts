import { getSessionAndRole } from "@/app/lib/api-auth";
import { getCrewDashboardData } from "@/app/actions/crew";
import { NextResponse } from "next/server";

export async function GET() {
  const { errorResponse, isStaff } = await getSessionAndRole();
  if (errorResponse) return errorResponse;

  if (!isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await getCrewDashboardData();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to retrieve dashboard data" }, { status: 500 });
  }
}

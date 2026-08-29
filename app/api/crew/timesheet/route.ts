import { getSessionAndRole } from "@/app/lib/api-auth";
import { getCrewDashboardData, saveCrewTimesheet } from "@/app/actions/crew";
import { NextResponse } from "next/server";

export async function GET() {
  const { errorResponse, isStaff } = await getSessionAndRole();
  if (errorResponse) return errorResponse;

  if (!isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await getCrewDashboardData();
    return NextResponse.json({
      today: data.today,
      attendanceWeek: data.attendanceWeek,
      codes: data.codes,
      hours: data.hours,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to retrieve timesheet" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { errorResponse, isStaff } = await getSessionAndRole();
  if (errorResponse) return errorResponse;

  if (!isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { codes } = body;
    if (!Array.isArray(codes)) {
      return NextResponse.json({ error: "Invalid request body: 'codes' must be an array" }, { status: 400 });
    }
    const result = await saveCrewTimesheet(codes);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save timesheet" }, { status: 500 });
  }
}

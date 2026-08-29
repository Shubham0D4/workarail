import { getSessionAndRole } from "@/app/lib/api-auth";
import { submitCrewLeaveRequest } from "@/app/actions/crew";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { errorResponse, isStaff } = await getSessionAndRole();
  if (errorResponse) return errorResponse;

  if (!isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { type, from, to, days, reason } = body;
    if (!type || !from || !to || typeof days !== "number" || !reason) {
      return NextResponse.json({ error: "Missing or invalid fields in request body" }, { status: 400 });
    }
    const result = await submitCrewLeaveRequest({ type, from, to, days, reason });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit leave request" }, { status: 500 });
  }
}

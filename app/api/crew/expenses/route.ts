import { getSessionAndRole } from "@/app/lib/api-auth";
import { submitCrewExpense } from "@/app/actions/crew";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { errorResponse, isStaff } = await getSessionAndRole();
  if (errorResponse) return errorResponse;

  if (!isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { date, category, merchant, description, amountPence, method, receipt } = body;
    if (!date || !category || !merchant || !description || typeof amountPence !== "number" || !method) {
      return NextResponse.json({ error: "Missing or invalid fields in request body" }, { status: 400 });
    }
    const result = await submitCrewExpense({ date, category, merchant, description, amountPence, method, receipt });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit expense" }, { status: 500 });
  }
}

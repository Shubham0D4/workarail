import { getSessionAndRole } from "@/app/lib/api-auth";
import { getExpenses } from "@/app/actions/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { errorResponse, isStaff } = await getSessionAndRole();
  if (errorResponse) return errorResponse;

  if (isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const expenses = await getExpenses();
    return NextResponse.json(expenses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to retrieve expenses" }, { status: 500 });
  }
}

import { getSessionAndRole } from "@/app/lib/api-auth";
import { getInvoices, addInvoice } from "@/app/actions/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { errorResponse, isStaff } = await getSessionAndRole();
  if (errorResponse) return errorResponse;

  if (isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const invoices = await getInvoices();
    return NextResponse.json(invoices);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to retrieve invoices" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { errorResponse, isStaff } = await getSessionAndRole();
  if (errorResponse) return errorResponse;

  if (isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { clientName, reference, amountPence, issued, due, status } = body;
    if (!clientName || !reference || typeof amountPence !== "number" || !issued || !due || !status) {
      return NextResponse.json({ error: "Missing or invalid required fields in request body" }, { status: 400 });
    }
    const result = await addInvoice({ clientName, reference, amountPence, issued, due, status });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create invoice" }, { status: 500 });
  }
}

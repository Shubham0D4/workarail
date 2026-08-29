import { getSessionAndRole } from "@/app/lib/api-auth";
import { getStaff, addStaffMember } from "@/app/actions/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { errorResponse, isStaff } = await getSessionAndRole();
  if (errorResponse) return errorResponse;

  if (isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const staff = await getStaff();
    return NextResponse.json(staff);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to retrieve staff list" }, { status: 500 });
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
    const { ref, name, email, phone, role, crewId, status, joined, birthday } = body;
    if (!ref || !name || !email || !role || !crewId || !status || !joined) {
      return NextResponse.json({ error: "Missing required fields in request body" }, { status: 400 });
    }
    const result = await addStaffMember({ ref, name, email, phone: phone || "", role, crewId, status, joined, birthday: birthday || "" });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add staff member" }, { status: 500 });
  }
}

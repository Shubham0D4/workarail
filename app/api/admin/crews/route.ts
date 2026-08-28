import { getSessionAndRole } from "@/app/lib/api-auth";
import { getCrews, addCrew } from "@/app/actions/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { errorResponse, isStaff } = await getSessionAndRole();
  if (errorResponse) return errorResponse;

  if (isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const crews = await getCrews();
    return NextResponse.json(crews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to retrieve crews list" }, { status: 500 });
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
    const { name } = body;
    if (!name) {
      return NextResponse.json({ error: "Missing 'name' field in request body" }, { status: 400 });
    }
    const result = await addCrew(name);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add crew" }, { status: 500 });
  }
}

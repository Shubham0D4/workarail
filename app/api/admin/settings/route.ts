import { getSessionAndRole } from "@/app/lib/api-auth";
import { getSettings, saveSettings } from "@/app/actions/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { errorResponse, isStaff } = await getSessionAndRole();
  if (errorResponse) return errorResponse;

  if (isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to retrieve settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { errorResponse, isStaff } = await getSessionAndRole();
  if (errorResponse) return errorResponse;

  if (isStaff) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const settings = await request.json();
    const result = await saveSettings(settings);
    return NextResponse.json({ success: true, settings: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save settings" }, { status: 500 });
  }
}

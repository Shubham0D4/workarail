import { auth } from "@/app/lib/auth";
import { checkIsStaff } from "@/app/actions/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function getSessionAndRole() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user) {
    return {
      errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      session: null,
      user: null,
      isStaff: false,
    };
  }

  const isStaff = await checkIsStaff(session.user.email);
  return {
    errorResponse: null,
    session,
    user: session.user,
    isStaff,
  };
}

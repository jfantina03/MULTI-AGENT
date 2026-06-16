import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("canva_access_token");
  cookieStore.delete("canva_refresh_token");
  return NextResponse.json({ ok: true });
}

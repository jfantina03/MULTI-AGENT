import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return new NextResponse("Missing url", { status: 400 });

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("canva_access_token")?.value;

  const headers: Record<string, string> = {};
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const res = await fetch(url, { headers });
  if (!res.ok) return new NextResponse("Image fetch failed", { status: 502 });

  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const buf = await res.arrayBuffer();
  const base64 = Buffer.from(buf).toString("base64");

  return NextResponse.json({ base64, mimeType: contentType });
}

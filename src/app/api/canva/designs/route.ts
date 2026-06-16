import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("canva_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ connected: false });
  }

  try {
    const res = await fetch("https://api.canva.com/rest/v1/designs", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[canva/designs] Canva API error:", res.status, errText);
      // Token may be expired — report as disconnected
      if (res.status === 401) {
        return NextResponse.json({ connected: false });
      }
      return NextResponse.json(
        { connected: false, error: "Canva API error" },
        { status: res.status }
      );
    }

    const data = (await res.json()) as { items?: unknown[] };
    return NextResponse.json({ connected: true, designs: data.items ?? [] });
  } catch (e) {
    console.error("[canva/designs] Unexpected error:", e);
    return NextResponse.json(
      { connected: false, error: "Internal error" },
      { status: 500 }
    );
  }
}

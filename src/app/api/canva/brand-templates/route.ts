import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("canva_access_token")?.value;
  if (!accessToken) return NextResponse.json({ connected: false, templates: [] });

  try {
    const res = await fetch("https://api.canva.com/rest/v1/brand-templates", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("[canva/brand-templates] error:", res.status, errBody);
      if (res.status === 401) return NextResponse.json({ connected: false, templates: [] });
      return NextResponse.json({ connected: true, templates: [], scopeMissing: true, debug: `${res.status}: ${errBody.slice(0, 200)}` });
    }

    interface BrandTemplate {
      id: string;
      title?: string;
      thumbnail?: { url?: string };
      view_url?: string;
    }
    const data = await res.json() as { items?: BrandTemplate[] };
    return NextResponse.json({ connected: true, templates: data.items ?? [] });
  } catch (e) {
    console.error("[canva/brand-templates] unexpected error:", e);
    return NextResponse.json({ connected: true, templates: [] });
  }
}

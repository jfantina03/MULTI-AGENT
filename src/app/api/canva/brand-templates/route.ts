import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("canva_access_token")?.value;
  if (!accessToken) return NextResponse.json({ connected: false, templates: [] });

  try {
    const res = await fetch("https://api.canva.com/rest/v1/brand-templates?ownership=team&sort_by=modified_descending", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      if (res.status === 401) return NextResponse.json({ connected: false, templates: [] });
      // 403 = missing scope — return empty so UI falls back to static buttons
      console.error("[canva/brand-templates] error:", res.status, await res.text());
      return NextResponse.json({ connected: true, templates: [], scopeMissing: true });
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

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("canva_access_token")?.value;
  if (!accessToken) return NextResponse.json({ error: "Non connecté à Canva" }, { status: 401 });

  const { title, designType, brandTemplateId } = await req.json() as {
    title?: string;
    designType?: string;
    brandTemplateId?: string;
  };

  let res: Response;

  if (brandTemplateId) {
    // Create from brand template
    res = await fetch(`https://api.canva.com/rest/v1/brand-templates/${brandTemplateId}/designs`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ title: title ?? "Nouveau design Orizon" }),
    });
  } else {
    // Create blank design
    res = await fetch("https://api.canva.com/rest/v1/designs", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title ?? "Nouveau design Orizon",
        design_type: { type: "preset", name: designType ?? "SocialMedia" },
      }),
    });
  }

  if (!res.ok) {
    const err = await res.text();
    console.error("[canva/create] error:", res.status, err);
    return NextResponse.json({ error: "Erreur Canva API" }, { status: res.status });
  }

  const data = await res.json() as { design?: { id: string; urls?: { edit_url?: string } } };
  return NextResponse.json({ ok: true, editUrl: data.design?.urls?.edit_url, design: data.design });
}

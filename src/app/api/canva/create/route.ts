import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("canva_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Non connecté à Canva" }, { status: 401 });
  }

  const { title, designType } = await req.json() as { title?: string; designType?: string };

  const body = {
    title: title ?? "Nouveau design Orizon",
    design_type: {
      type: "preset",
      name: designType ?? "SocialMedia",
    },
  };

  const res = await fetch("https://api.canva.com/rest/v1/designs", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[canva/create] error:", res.status, err);
    return NextResponse.json({ error: "Erreur Canva API" }, { status: res.status });
  }

  const data = await res.json() as { design?: { id: string; urls?: { edit_url?: string } } };
  const editUrl = data.design?.urls?.edit_url;

  return NextResponse.json({ ok: true, editUrl, design: data.design });
}

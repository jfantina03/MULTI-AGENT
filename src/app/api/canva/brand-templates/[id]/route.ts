import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("canva_access_token")?.value;
  if (!token) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { id } = await params;

  const res = await fetch(`https://api.canva.com/rest/v1/brand-templates/${id}/dataset`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[canva/brand-templates/dataset] error:", res.status, err);
    return NextResponse.json({ error: err, fields: {} }, { status: res.status });
  }

  const data = await res.json() as { dataset?: Record<string, { type: string }> };
  return NextResponse.json({ fields: data.dataset ?? {} });
}

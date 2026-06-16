import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("canva_access_token")?.value ?? null;
}

// POST /api/canva/autofill — start an autofill job
export async function POST(req: NextRequest) {
  const token = await getToken();
  if (!token) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { templateId, title, data } = await req.json() as {
    templateId: string;
    title?: string;
    data: Record<string, { type: "text"; text: string }>;
  };

  const res = await fetch(`https://api.canva.com/rest/v1/brand-templates/${templateId}/autofills`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ title: title ?? "Nouveau design Orizon", data }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[canva/autofill] POST error:", res.status, err);
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const body = await res.json() as { job?: { id: string; status: string } };
  return NextResponse.json({ jobId: body.job?.id, status: body.job?.status });
}

// GET /api/canva/autofill?jobId=...&templateId=...  — poll job status
export async function GET(req: NextRequest) {
  const token = await getToken();
  if (!token) return NextResponse.json({ error: "Non connecté" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");
  const templateId = searchParams.get("templateId");
  if (!jobId || !templateId) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  const res = await fetch(`https://api.canva.com/rest/v1/brand-templates/${templateId}/autofills/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const body = await res.json() as {
    job?: {
      id: string;
      status: "in_progress" | "success" | "failed";
      result?: { design?: { id: string; urls?: { edit_url?: string } } };
      error?: unknown;
    };
  };

  const job = body.job;
  if (job?.status === "success") {
    return NextResponse.json({ status: "success", editUrl: job.result?.design?.urls?.edit_url });
  }
  if (job?.status === "failed") {
    return NextResponse.json({ status: "failed", error: job.error });
  }
  return NextResponse.json({ status: "in_progress" });
}

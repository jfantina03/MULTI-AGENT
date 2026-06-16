import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const FOLDER_ID = "FAHMvdO6O28";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("canva_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ connected: false });
  }

  try {
    const res = await fetch(`https://api.canva.com/rest/v1/folders/${FOLDER_ID}/items`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 401) return NextResponse.json({ connected: false });
      const err = await res.text();
      console.error("[canva/designs] error:", res.status, err);
      return NextResponse.json({ connected: false, error: "Canva API error" }, { status: res.status });
    }

    interface FolderItem {
      type: string;
      design?: {
        id: string;
        title?: string;
        thumbnail?: { url?: string };
        urls?: { view_url?: string; edit_url?: string };
      };
    }
    const data = await res.json() as { items?: FolderItem[] };
    const designs = (data.items ?? [])
      .filter((item) => item.type === "DESIGN" && item.design)
      .map((item) => item.design!);
    return NextResponse.json({ connected: true, designs });
  } catch (e) {
    console.error("[canva/designs] unexpected error:", e);
    return NextResponse.json({ connected: false, error: "Internal error" }, { status: 500 });
  }
}

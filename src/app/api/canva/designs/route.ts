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

  interface DesignItem {
    id: string;
    title?: string;
    thumbnail?: { url?: string };
    urls?: { view_url?: string; edit_url?: string };
  }

  async function fetchFromFolder(): Promise<DesignItem[] | null> {
    const res = await fetch(`https://api.canva.com/rest/v1/folders/${FOLDER_ID}/items`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    interface FolderItem { type: string; design?: DesignItem; }
    const data = await res.json() as { items?: FolderItem[] };
    return (data.items ?? []).filter((i) => i.type === "DESIGN" && i.design).map((i) => i.design!);
  }

  async function fetchAllDesigns(): Promise<DesignItem[] | null> {
    const res = await fetch("https://api.canva.com/rest/v1/designs?ownership=owned&sort_by=modified_descending", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      if (res.status === 401) return null;
      console.error("[canva/designs] list error:", res.status, await res.text());
      return [];
    }
    const data = await res.json() as { items?: DesignItem[] };
    return data.items ?? [];
  }

  try {
    // Try folder first; if missing scope (403) fall back to listing all designs
    const folderDesigns = await fetchFromFolder();
    if (folderDesigns !== null) {
      return NextResponse.json({ connected: true, designs: folderDesigns, source: "folder" });
    }

    const allDesigns = await fetchAllDesigns();
    if (allDesigns === null) return NextResponse.json({ connected: false });
    return NextResponse.json({ connected: true, designs: allDesigns, source: "all" });
  } catch (e) {
    console.error("[canva/designs] unexpected error:", e);
    return NextResponse.json({ connected: false, error: "Internal error" }, { status: 500 });
  }
}

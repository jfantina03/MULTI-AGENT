import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("canva_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ cookie: false, clientId: !!process.env.CANVA_CLIENT_ID });
  }

  // Verify token with Canva profile endpoint
  try {
    const profileRes = await fetch("https://api.canva.com/rest/v1/users/me/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profileOk = profileRes.ok;
    const profileData = profileRes.ok ? await profileRes.json() as Record<string, unknown> : null;

    // Test folder access
    const folderRes = await fetch("https://api.canva.com/rest/v1/folders/FAHMvdO6O28/items", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const folderStatus = folderRes.status;
    const folderBody = await folderRes.text();

    // Test brand templates
    const btRes = await fetch("https://api.canva.com/rest/v1/brand-templates", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const btStatus = btRes.status;
    const btBody = await btRes.text();

    return NextResponse.json({
      cookie: true,
      tokenPrefix: accessToken.slice(0, 8) + "…",
      profile: profileOk ? { display_name: (profileData as { profile?: { display_name?: string } })?.profile?.display_name } : null,
      profileStatus: profileRes.status,
      folderStatus,
      folderBody: folderBody.slice(0, 200),
      brandTemplatesStatus: btStatus,
      brandTemplatesBody: btBody.slice(0, 300),
    });
  } catch (e) {
    return NextResponse.json({ cookie: true, error: String(e) });
  }
}

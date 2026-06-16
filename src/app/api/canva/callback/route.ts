import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const CLIENT_ID = process.env.CANVA_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.CANVA_CLIENT_SECRET ?? "";
const REDIRECT_URI =
  process.env.CANVA_REDIRECT_URI ??
  "https://multi-agent-beige-xi.vercel.app/api/canva/callback";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("canva_oauth_state")?.value;
  const codeVerifier = cookieStore.get("canva_code_verifier")?.value;

  cookieStore.delete("canva_oauth_state");
  cookieStore.delete("canva_code_verifier");

  if (error) {
    console.error("[canva/callback] OAuth error:", error);
    return NextResponse.redirect(new URL("/?canva_error=1", req.url));
  }

  if (!code || !state || state !== storedState || !codeVerifier) {
    console.error("[canva/callback] Invalid state, missing code or verifier");
    return NextResponse.redirect(new URL("/?canva_error=1", req.url));
  }

  try {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code_verifier: codeVerifier,
    });

    const tokenRes = await fetch(
      "https://api.canva.com/rest/v1/oauth/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      }
    );

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("[canva/callback] Token exchange failed:", tokenRes.status, errText);
      return NextResponse.redirect(new URL("/?canva_error=1", req.url));
    }

    const tokenData = (await tokenRes.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
    };

    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set("canva_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: tokenData.expires_in ?? 3600,
      path: "/",
    });

    if (tokenData.refresh_token) {
      cookieStore.set("canva_refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }

    return NextResponse.redirect(new URL("/", req.url));
  } catch (e) {
    console.error("[canva/callback] Unexpected error:", e);
    return NextResponse.redirect(new URL("/?canva_error=1", req.url));
  }
}

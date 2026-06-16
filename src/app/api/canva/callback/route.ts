import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPkceVerifier } from "../auth/route";

export const runtime = "nodejs";

const CLIENT_ID = process.env.CANVA_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.CANVA_CLIENT_SECRET ?? "";
const REDIRECT_URI =
  process.env.CANVA_REDIRECT_URI ??
  "https://multi-agent-beige-xi.vercel.app/api/canva/callback";

const HOME = "/?agent=lilou&tab=canva";
const ERR = "/?agent=lilou&tab=canva&canva_error=1";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code || !state) {
    console.error("[canva/callback] missing code/state or error:", error);
    return NextResponse.redirect(new URL(ERR, req.url));
  }

  const codeVerifier = state ? getPkceVerifier(state) : undefined;

  const bodyParams: Record<string, string> = {
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };
  if (codeVerifier) bodyParams.code_verifier = codeVerifier;

  try {
    const tokenRes = await fetch("https://api.canva.com/rest/v1/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(bodyParams).toString(),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("[canva/callback] token exchange failed:", tokenRes.status, err);
      return NextResponse.redirect(new URL(ERR, req.url));
    }

    const tokenData = await tokenRes.json() as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
    };

    const isProd = process.env.NODE_ENV === "production";
    const cookieStore = await cookies();
    cookieStore.set("canva_access_token", tokenData.access_token, {
      httpOnly: true, secure: isProd, sameSite: "lax",
      maxAge: tokenData.expires_in ?? 3600, path: "/",
    });
    if (tokenData.refresh_token) {
      cookieStore.set("canva_refresh_token", tokenData.refresh_token, {
        httpOnly: true, secure: isProd, sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, path: "/",
      });
    }

    return NextResponse.redirect(new URL(HOME, req.url));
  } catch (e) {
    console.error("[canva/callback] unexpected error:", e);
    return NextResponse.redirect(new URL(ERR, req.url));
  }
}

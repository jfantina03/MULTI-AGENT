import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export const runtime = "nodejs";

const CLIENT_ID = process.env.CANVA_CLIENT_ID ?? "";
const REDIRECT_URI =
  process.env.CANVA_REDIRECT_URI ??
  "https://multi-agent-beige-xi.vercel.app/api/canva/callback";

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: "design:content:read design:content:write design:meta:read asset:read asset:write profile:read",
    state,
  });

  const authUrl = `https://www.canva.com/api/oauth/authorize?${params.toString()}`;

  const cookieStore = await cookies();
  cookieStore.set("canva_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  return NextResponse.redirect(authUrl);
}

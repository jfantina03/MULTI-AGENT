import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

const CLIENT_ID = process.env.CANVA_CLIENT_ID ?? "";
const REDIRECT_URI =
  process.env.CANVA_REDIRECT_URI ??
  "https://multi-agent-beige-xi.vercel.app/api/canva/callback";

function base64urlEncode(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");
  const codeVerifier = base64urlEncode(crypto.randomBytes(32));
  const codeChallenge = base64urlEncode(
    crypto.createHash("sha256").update(codeVerifier).digest()
  );

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: "design:content:read design:content:write design:meta:read asset:read asset:write profile:read",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  const authUrl = `https://www.canva.com/api/oauth/authorize?${params.toString()}`;

  const isProd = process.env.NODE_ENV === "production";
  const cookieOpts = `; HttpOnly; Path=/; Max-Age=600; SameSite=Lax${isProd ? "; Secure" : ""}`;

  const response = NextResponse.redirect(authUrl);
  response.headers.append("Set-Cookie", `canva_oauth_state=${state}${cookieOpts}`);
  response.headers.append("Set-Cookie", `canva_code_verifier=${codeVerifier}${cookieOpts}`);
  return response;
}

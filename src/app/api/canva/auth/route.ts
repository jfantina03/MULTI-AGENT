import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

const CLIENT_ID = process.env.CANVA_CLIENT_ID ?? "";
const REDIRECT_URI =
  process.env.CANVA_REDIRECT_URI ??
  "https://multi-agent-beige-xi.vercel.app/api/canva/callback";

// In-memory store for PKCE verifiers (per state, TTL 10 min)
// This works because Vercel routes are sticky per instance during the OAuth flow
const pkceStore = new Map<string, { verifier: string; exp: number }>();

function base64urlEncode(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function getPkceVerifier(state: string): string | undefined {
  const entry = pkceStore.get(state);
  if (!entry || Date.now() > entry.exp) { pkceStore.delete(state); return undefined; }
  pkceStore.delete(state);
  return entry.verifier;
}

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");
  const codeVerifier = base64urlEncode(crypto.randomBytes(32));
  const codeChallenge = base64urlEncode(
    crypto.createHash("sha256").update(codeVerifier).digest()
  );

  pkceStore.set(state, { verifier: codeVerifier, exp: Date.now() + 10 * 60 * 1000 });

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
  return NextResponse.redirect(authUrl);
}

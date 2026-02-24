import { NextRequest, NextResponse } from "next/server";

function stripHopByHopHeaders(headers: Headers) {
  const hopByHop = new Set([
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
    "host",
  ]);
  hopByHop.forEach((h) => headers.delete(h));
  return headers;
}

async function handler(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;

  const base = process.env.CHRONOZONE_API_BASE;
  if (!base) {
    return NextResponse.json({ error: "CHRONOZONE_API_BASE not set" }, { status: 500 });
  }

  const url = new URL(req.url);
  const target = new URL(base.replace(/\/$/, "") + "/" + path.join("/"));
  target.search = url.search;

  const headers = new Headers(req.headers);
  stripHopByHopHeaders(headers);

  // Optional shared key if you add it later
  const apiKey = process.env.CHRONOZONE_API_KEY;
  if (apiKey) headers.set("x-chronozone-key", apiKey);

  const init: RequestInit = {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.arrayBuffer(),
    redirect: "manual",
  };

  const resp = await fetch(target.toString(), init);

  const outHeaders = new Headers(resp.headers);
  stripHopByHopHeaders(outHeaders);

  return new NextResponse(resp.body, {
    status: resp.status,
    headers: outHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;

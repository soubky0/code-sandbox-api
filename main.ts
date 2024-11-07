import { executePythonCode } from "./helper.ts";

export async function handler(_req: Request): Promise<Response> {
  const url = new URL(_req.url);
  if (url.pathname === "/execute" && _req.method === "POST") {
    const body = await _req.json();
    const response = await executePythonCode(body.code);
    const json = JSON.stringify(response);
    return new Response(json, {
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response("Server running");
}

Deno.serve(handler);

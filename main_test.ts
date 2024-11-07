import { assertEquals } from "@std/assert";
import { handler } from "./main.ts";

Deno.test("Server running", async () => {
  const request = new Request("http://localhost");
  const response = handler(request);
  assertEquals(response.status, 200);
  const text = await response.text();
  assertEquals(text, "Hello, World!");
});

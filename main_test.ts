import { assertEquals, assertStringIncludes } from "@std/assert";
import { handler } from "./main.ts";

Deno.test("Server running", async () => {
  const request = new Request("http://localhost");
  const response = await handler(request);
  assertEquals(response.status, 200);
  const text = await response.text();
  assertEquals(text, "Server running");
});

Deno.test("Level 1:  Basic Code Execution", async (t) => {
  await t.step("Running Hello World", async () => {
    const request = new Request("http://localhost/execute", {
      method: "POST",
      body: JSON.stringify({ code: "print('Hello, World!')" }),
    });
    const response = await handler(request);
    assertEquals(response.status, 200);
    const text = await response.text();
    assertEquals(text, '{"stdout":"Hello, World!\\n"}');
  });

  await t.step("Running 1 / 0", async () => {
    const request = new Request("http://localhost/execute", {
      method: "POST",
      body: JSON.stringify({ code: "1 / 0" }),
    });
    const response = await handler(request);
    assertEquals(response.status, 200);
    const text = await response.text();
    assertStringIncludes(
      text,
      '{"stderr":"Traceback (most recent call last):\\n  File \\"<stdin>\\"',
    );
  });
});

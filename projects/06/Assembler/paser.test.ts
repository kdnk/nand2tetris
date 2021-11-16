import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";

import { commandType } from "./parser.ts";

Deno.test("commandType run properly.", () => {
  const received = commandType("@xxx");
  const expected = "A_COMMAND";

  assertEquals(received, expected);
});

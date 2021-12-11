import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import {
  beforeEach,
  describe,
  it,
} from "https://deno.land/x/test_suite@0.9.1/mod.ts";

import { Code } from "./code.ts";

describe("Code", () => {
  let code: Code;
  beforeEach(() => {
    code = new Code();
  });

  it("dest", () => {
    assertEquals(code.dest("null"), "000");
  });

  it("comp", () => {
    assertEquals(code.comp("D"), "001100");
    assertEquals(code.comp("M"), "110000");
  });

  it("jump", () => {
    assertEquals(code.dest("null"), "000");
  });
});

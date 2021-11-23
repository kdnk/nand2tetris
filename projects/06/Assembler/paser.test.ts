import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import {
  beforeEach,
  describe,
  it,
} from "https://deno.land/x/test_suite@0.9.1/mod.ts";

import { Parser } from "./parser.ts";

const FILE_PATH = "./projects/06/add/Add.asm";

describe("Parser", () => {
  let parser: Parser;
  beforeEach(() => {
    parser = new Parser(FILE_PATH);
  });

  it("commandType run properly.", () => {
    const received = parser.commandType("@xxx");
    const expected = "A_COMMAND";

    assertEquals(received, expected);
  });

  describe("hasMoreCommands", () => {
    it("return true when command still exists", () => {
      const received = parser.hasMoreCommands();
      const expected = true;

      assertEquals(received, expected);
    });

    it("return false when command doesn't exist", () => {
      parser.currentCommandIndex = 100;
      const received = parser.hasMoreCommands();
      const expected = false;

      assertEquals(received, expected);
    });
  });

  describe("advance", () => {
    it("updates next line", () => {
      assertEquals(parser.currentCommandIndex, 0);
      parser.advance();
      assertEquals(parser.currentCommandIndex, 1);
    });
    it("does not anything", () => {
      parser.currentCommandIndex = 100;
      assertEquals(parser.currentCommandIndex, 100);
      parser.advance();
      assertEquals(parser.currentCommandIndex, 100);
    });
  });
});

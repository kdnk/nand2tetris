import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import {
  beforeEach,
  describe,
  it,
} from "https://deno.land/x/test_suite@0.9.1/mod.ts";

import { Parser } from "./parser.ts";

const FILE_PATH = "./projects/07/StackArithmetic/SimpleAdd/SimpleAdd.vm";

describe("Parser", () => {
  let parser: Parser;
  beforeEach(() => {
    parser = new Parser(FILE_PATH);
  });

  describe("commandType", () => {
    it("commandType is C_ARITHMETIC", () => {
      parser.commands = ["add"];
      parser.currentCommandIndex = 0;

      assertEquals(parser.commandType(), "C_ARITHMETIC");
    });
    it("commandType is C_POP", () => {
      parser.commands = ["pop that 5"];
      parser.currentCommandIndex = 0;

      assertEquals(parser.commandType(), "C_POP");
    });
    it("commandType is C_PUSH", () => {
      parser.commands = ["push constant 22"];
      parser.currentCommandIndex = 0;

      assertEquals(parser.commandType(), "C_PUSH");
    });
  });

  describe("hasMoreCommands", () => {
    it("return true when command still exists", () => {
      assertEquals(parser.hasMoreCommands(), true);
    });

    it("return false when command doesn't exist", () => {
      parser.currentCommandIndex = 100;
      assertEquals(parser.hasMoreCommands(), false);
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

  describe("arg1", () => {
    it("C_ARITHMETIC", () => {
      parser.commands = ["add"];
      parser.currentCommandIndex = 0;

      assertEquals(parser.arg1(), "add");
    });
    it("C_POP", () => {
      parser.commands = ["pop that 5"];
      parser.currentCommandIndex = 0;

      assertEquals(parser.arg1(), "that");
    });
    it("C_PUSH", () => {
      parser.commands = ["push constant 22"];
      parser.currentCommandIndex = 0;

      assertEquals(parser.arg1(), "constant");
    });
    it("does not anything", () => {
      parser.currentCommandIndex = 100;
      assertEquals(parser.currentCommandIndex, 100);
      parser.advance();
      assertEquals(parser.currentCommandIndex, 100);
    });
  });

  describe("arg2", () => {
    it("C_POP", () => {
      parser.commands = ["pop that 5"];
      parser.currentCommandIndex = 0;

      assertEquals(parser.arg2(), "5");
    });
    it("C_PUSH", () => {
      parser.commands = ["push constant 22"];
      parser.currentCommandIndex = 0;

      assertEquals(parser.arg2(), "22");
    });
    it("C_FUNCTION", () => {});
    it("C_CALL", () => {});
  });
});

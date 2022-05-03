import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import {
  beforeEach,
  describe,
  it,
} from "https://deno.land/x/test_suite@0.9.1/mod.ts";

import { CodeWriter } from "./code-writer.ts";

const FILE_PATH = "./projects/07/StackArithmetic/SimpleAdd/SimpleAdd.vm";

describe("CodeWriter", () => {
  let codeWriter: CodeWriter;
  beforeEach(() => {
    codeWriter = new CodeWriter(FILE_PATH);
  });

  describe("writePushPop", () => {
  });

  describe("arithmeticToAssembly", () => {
    it("add", () => {
      assertEquals(codeWriter.arithmeticToAssembly("add"), [
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "D=M",
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "A=M",
        "D=A+D",
        "@SP",
        "M=D",
        "@SP",
        "M=M+1",
      ]);
    });
    it("sub", () => {
      assertEquals(codeWriter.arithmeticToAssembly("sub"), [
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "D=M",
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "A=M",
        "D=A-D",
        "@SP",
        "M=D",
        "@SP",
        "M=M+1",
      ]);
    });
    it("neg", () => {
      assertEquals(codeWriter.arithmeticToAssembly("neg"), [
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "D=M",
        "D=-D",
        "@SP",
        "M=D",
        "@SP",
        "M=M+1",
      ]);
    });
    it("eq", () => {
      assertEquals(codeWriter.arithmeticToAssembly("eq"), [
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "D=M",
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "A=M",
        "D=A-D",
        "@LABEL1",
        "D;JEQ",
        "@SP",
        "M=0",
        "@LABEL2",
        "0;JMP",
        "(LABEL1)",
        "@SP",
        "M=-1",
        "(LABEL2)",
        "@SP",
        "M=M+1",
      ]);
    });
    it("lt", () => {
      assertEquals(codeWriter.arithmeticToAssembly("lt"), [
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "D=M",
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "A=M",
        "D=A-D",
        "@LABEL1",
        "D;JLT",
        "@SP",
        "M=0",
        "@LABEL2",
        "0;JMP",
        "(LABEL1)",
        "@SP",
        "M=-1",
        "(LABEL2)",
        "@SP",
        "M=M+1",
      ]);
    });
    it("gt", () => {
      assertEquals(codeWriter.arithmeticToAssembly("gt"), [
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "D=M",
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "A=M",
        "D=A-D",
        "@LABEL1",
        "D;JGT",
        "@SP",
        "M=0",
        "@LABEL2",
        "0;JMP",
        "(LABEL1)",
        "@SP",
        "M=-1",
        "(LABEL2)",
        "@SP",
        "M=M+1",
      ]);
    });
    it("and", () => {
      assertEquals(codeWriter.arithmeticToAssembly("and"), [
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "D=M",
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "A=M",
        "D=A&D",
        "@SP",
        "M=D",
        "@SP",
        "M=M+1",
      ]);
    });
    it("or", () => {
      assertEquals(codeWriter.arithmeticToAssembly("or"), [
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "D=M",
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "A=M",
        "D=A|D",
        "@SP",
        "M=D",
        "@SP",
        "M=M+1",
      ]);
    });
    it("not", () => {
      assertEquals(codeWriter.arithmeticToAssembly("not"), [
        "@SP",
        "M=M-1",
        "@SP",
        "A=M",
        "D=M",
        "D=!D",
        "@SP",
        "M=D",
        "@SP",
        "M=M+1",
      ]);
    });
  });
});
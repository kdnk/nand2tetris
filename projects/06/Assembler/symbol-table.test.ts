import { assertEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import {
  beforeEach,
  describe,
  it,
} from "https://deno.land/x/test_suite@0.9.1/mod.ts";

import { SymbolTable } from "./symbol-table.ts";

describe("SymbolTable", () => {
  let symbolTable: SymbolTable;
  beforeEach(() => {
    symbolTable = new SymbolTable();
  });

  it("addEntry", () => {
    symbolTable.addEntry("hello", 1111);
    assertEquals(symbolTable.table["hello"], 1111);
  });

  it("contains", () => {
    symbolTable.addEntry("hello", 1111);
    assertEquals(symbolTable.contains("hello"), true);
  });

  it("getAddress", () => {
    symbolTable.addEntry("hello", 1111);
    assertEquals(symbolTable.getAddress("hello"), 1111);
  });
});

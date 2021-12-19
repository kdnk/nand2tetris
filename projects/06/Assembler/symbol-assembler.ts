import { parse } from "https://deno.land/std@0.117.0/flags/mod.ts";

import { Parser } from "./parser.ts";
import { SymbolTable } from "./symbol-table.ts";
import { Code, isComp0 } from "./code.ts";

/* ex
~/go/src/github.com/kdnk/nand2tetris/projects/06 main
❯ deno run --allow-read --allow-write ./Assembler/symbol-assembler.ts --input ./max/Max.asm --output ./max/Max.hack
*/

const A_OEDER = 0;
const C_ORDER = 1;

symbolAssember();

function symbolAssember() {
  const parsedArgs = parse(Deno.args);
  if (!parsedArgs.input || !parsedArgs.output) {
    throw new Error("no args");
  }

  const inputFilePath = parsedArgs.input;
  const outputFilePath = parsedArgs.output;
  const symbolTable = new SymbolTable();

  // constructor
  const PRE_DEFINED_SYMBOL_MAP = {
    "SP": 0,
    "LCL": 1,
    "ARG": 2,
    "THIS": 3,
    "THAT": 4,
    "R0": 0,
    "R1": 1,
    "R2": 2,
    "R3": 3,
    "R4": 4,
    "R5": 5,
    "R6": 6,
    "R7": 7,
    "R8": 8,
    "R9": 9,
    "R10": 10,
    "R11": 11,
    "R12": 12,
    "R13": 13,
    "R14": 14,
    "R15": 15,
    "SCREEN": 16348,
    "KBD": 24576,
  };
  symbolTable.table = PRE_DEFINED_SYMBOL_MAP;

  // first path
  const parser = new Parser(inputFilePath);
  while (parser.hasMoreCommands()) {
    if (parser.commandType() === "L_COMMAND") {
      const symbol = parser.symbol();
      symbolTable.addEntry(symbol, parser.currentCommandIndex + 1);
    } else {
      // noop
    }
    parser.advance();
  }

  // second path
  const lines = [];
  let address = 16;
  const parser2 = new Parser(inputFilePath);
  console.log(`[symbol-assembler.ts:66] parser2.commands: `, parser2.commands);
  debugger;
  while (parser2.hasMoreCommands()) {
    if (parser2.commandType() === "A_COMMAND") { // @XXX
      const symbol = parser2.symbol();
      if (Number.isNaN(Number(symbol)) /* == if symbol isn't number */) {
        if (symbolTable.contains(symbol)) {
          const address = symbolTable.getAddress(symbol);
          const binary = decimalToBinary(address);
          lines.push(binary);
        } else {
          symbolTable.addEntry(symbol, address);
          const binary = decimalToBinary(address);
          lines.push(binary);
          address++;
        }
      } else {
        const binary = decimalToBinary(Number(symbol));
        lines.push(binary);
      }
    } else if (parser2.commandType() === "C_COMMAND") { // dest = comp;jump
      const code = new Code();
      console.log(
        `[symbol-assembler.ts:86] parser2.commandType(): `,
        parser2.commandType(),
      );
      console.log(
        `[symbol-assembler.ts:90] parser2.commands[parser2.currentCommandIndex]: `,
        parser2.commands[parser2.currentCommandIndex],
      );
      const orderType: typeof A_OEDER | typeof C_ORDER = isComp0(parser2.comp())
        ? A_OEDER
        : C_ORDER;
      const binary = `111${orderType}${code.comp(parser2.comp())}${
        code.dest(parser2.dest())
      }${code.jump(parser2.jump())}`;
      lines.push(binary);
    } else if (parser2.commandType() === "L_COMMAND") { // (XXX)
      // noop
    }
    parser2.advance();
  }
  Deno.writeTextFileSync(outputFilePath, lines.join("\n"));
}

function decimalToBinary(num: number): string {
  const binary = num.toString(2);
  return binary.padStart(16, "0");
}

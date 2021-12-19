import { parse } from "https://deno.land/std@0.117.0/flags/mod.ts";

import { Parser } from "./parser.ts";
import { Code, isComp0 } from "./code.ts";

/* ex.
~/go/src/github.com/kdnk/nand2tetris/projects/06 main*
❯ deno run --allow-read --allow-write ./Assembler/symbol-free-assembler.ts --input ./add/Add.asm --output ./add/Add.hack
*/

const A_OEDER = 0;
const C_ORDER = 1;

symbolFreeAssembler();

function symbolFreeAssembler() {
  const parsedArgs = parse(Deno.args);
  if (!parsedArgs.input || !parsedArgs.output) {
    throw new Error("no args");
  }
  const inputFilePath = parsedArgs.input;
  const outputFilePath = parsedArgs.output;
  const parser = new Parser(inputFilePath);

  const lines = [];
  while (parser.hasMoreCommands()) {
    if (parser.commandType() === "A_COMMAND") {
      const symbol = parser.symbol();
      const binary = decimalToBinary(Number(symbol));
      lines.push(binary);
    } else if (parser.commandType() === "C_COMMAND") {
      const code = new Code();
      const orderType: typeof A_OEDER | typeof C_ORDER = isComp0(parser.comp())
        ? A_OEDER
        : C_ORDER;
      const binary = `111${orderType}${code.comp(parser.comp())}${
        code.dest(parser.dest())
      }${code.jump(parser.jump())}`;
      lines.push(binary);
    } else if (parser.commandType() === "L_COMMAND") {
      throw new Error("Symbol-free-assembler wouldn't have L_COMMAND.");
    }
    parser.advance();
  }
  Deno.writeTextFileSync(outputFilePath, lines.join("\n"));
}

function decimalToBinary(num: number): string {
  const binary = num.toString(2);
  return binary.padStart(16, "0");
}

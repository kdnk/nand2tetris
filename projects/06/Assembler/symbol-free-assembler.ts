import { Parser } from "./parser.ts";
import { Code, isComp0 } from "./code.ts";

symbolFreeAssembler();

function symbolFreeAssembler() {
  // const haskFile = Deno.openSync("./Prog.hack");
  const parser = new Parser("./add/Add.asm");

  const lines = [];
  while (parser.hasMoreCommands()) {
    if (parser.commandType() === "A_COMMAND") {
      const symbol = parser.symbol();
      const binary = decimalToBinary(Number(symbol));
      lines.push(binary);
    } else if (parser.commandType() === "C_COMMAND") {
      const code = new Code();
      const isA: 0 | 1 = isComp0(parser.comp()) ? 0 : 1;
      const binary = `111${isA}${code.comp(parser.comp())}${
        code.dest(parser.dest())
      }${code.jump(parser.jump())}`;
      lines.push(binary);
    } else if (parser.commandType() === "L_COMMAND") {
      throw new Error("Symbol-free-assembler wouldn't have L_COMMAND.");
    }
    parser.advance();
  }
  console.log(lines);
}

function decimalToBinary(num: number): string {
  const binary = num.toString(2);
  return binary.padStart(16, "0");
}

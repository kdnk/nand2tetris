import { type COMMAND_TYPE } from "./parser.ts";

type SEGMENT =
  | "argument"
  | "local"
  | "static"
  | "constant"
  | "this"
  | "that"
  | "pointer"
  | "temp";

export class CodeWriter {
  fileName: string;
  assemblies: string[];

  constructor(fileName: string) {
    this.fileName = fileName;
    this.assemblies = [];
  }

  setFileName(fileName: string) {
    this.fileName = fileName;
  }

  writeArithmetic(command: string) {
    // Deno.writeTextFileSync(this.fileName);
  }

  writePushPop(
    command: Extract<COMMAND_TYPE, "C_POP" | "C_PUSH">,
    segment: SEGMENT,
    index: number,
  ) {
  }

  arithmeticToAssembly(command: string) {
    if (command === "add") {
      this.#binary("A+D");
      return this.assemblies;
    } else if (command === "sub") {
      this.#binary("A-D");
      return this.assemblies;
    } else if (command === "neg") {
      this.#unary("-D");
      return this.assemblies;
    }
  }

  close() {}

  #unary(comp: string): void {
    this.#decrementStackPointer();
    this.#stackToDest("D"); // D=M[SP]
    this.#cCommand("D", comp, undefined); // D = comp (このcompではDが使われているので上書きしているようにみえるが問題ない)
    this.#compToStack("D");
    this.#incrementStackPointer();
  }

  #binary(comp: string): void {
    this.#decrementStackPointer();
    this.#stackToDest("D"); // D=M[SP]

    this.#decrementStackPointer();
    this.#stackToDest("A"); // A=M[SP]

    this.#cCommand("D", comp, undefined);
    this.#compToStack("D");
    this.#incrementStackPointer();
  }

  #incrementStackPointer(): void {
    this.#aCommand("SP"); // A = address of SP
    this.#cCommand("M", "M+1", undefined); // SP=SP+1
  }

  #decrementStackPointer(): void {
    this.#aCommand("SP"); // A = address of SP
    this.#cCommand("M", "M-1", undefined); // SP=SP-1
  }

  #aCommand(address: string): void {
    this.assemblies.push(`@${address}`);
  }

  #cCommand(
    dest: string | undefined,
    comp: string,
    jump: string | undefined,
  ): void {
    // dest=comp;jump
    let output = "";
    if (dest) {
      output += `${dest}=`;
    }
    output += comp;
    if (jump) {
      output += `;${jump}`;
    }
    this.assemblies.push(output);
  }

  #loadStackPointer() {
    // SPというポインタに格納されている値にアクセスするための準備
    // M[SP] できるようになるということ
    this.#aCommand("SP"); // A = address of SP
    this.#cCommand("A", "M", undefined); // A=M
  }

  #stackToDest(dest: string) {
    // destにSPポインタが参照している値を代入する
    this.#loadStackPointer();
    this.#cCommand(dest, "M", undefined);
  }

  #compToStack(comp: string) {
    this.#aCommand("SP"); // A = address of SP
    this.#cCommand("M", comp, undefined);
  }
}

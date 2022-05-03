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

type COMMAND =
  | "add"
  | "sub"
  | "neg"
  | "eq"
  | "gt"
  | "lt"
  | "and"
  | "or"
  | "not";

export class CodeWriter {
  fileName: string;
  assemblies: string[];
  labelNumber: number;

  constructor(fileName: string) {
    this.fileName = fileName;
    this.assemblies = [];
    this.labelNumber = 0;
  }

  setFileName(fileName: string) {
    this.fileName = fileName;
  }

  writeArithmetic(command: COMMAND) {
    // Deno.writeTextFileSync(this.fileName);
  }

  writePushPop(
    command: Extract<COMMAND_TYPE, "C_POP" | "C_PUSH">,
    segment: SEGMENT,
    index: number,
  ) {
    if (command === "C_PUSH") {
      this.#push(segment, index);
      return this.assemblies;
    }
  }

  pushPopToAssembly(
    command: Extract<COMMAND_TYPE, "C_POP" | "C_PUSH">,
    segment: SEGMENT,
    index: number,
  ): string[] {
    if (command === "C_PUSH") {
      this.#push(segment, index);
      return this.assemblies;
    } else {
      throw new Error(`#{command}`);
    }
  }

  arithmeticToAssembly(command: COMMAND): string[] {
    if (command === "add") {
      this.#binary("A+D");
      return this.assemblies;
    } else if (command === "sub") {
      this.#binary("A-D");
      return this.assemblies;
    } else if (command === "neg") {
      this.#unary("-D");
      return this.assemblies;
    } else if (command === "eq") {
      this.#compare("JEQ");
      return this.assemblies;
    } else if (command === "lt") {
      this.#compare("JLT");
      return this.assemblies;
    } else if (command === "gt") {
      this.#compare("JGT");
      return this.assemblies;
    } else if (command === "and") {
      this.#binary("A&D");
      return this.assemblies;
    } else if (command === "or") {
      this.#binary("A|D");
      return this.assemblies;
    } else if (command === "not") {
      this.#unary("!D");
      return this.assemblies;
    } else {
      throw new Error(`#{command}`);
    }
  }

  close() {}

  #unary(comp: string): void {
    this.#decrementStackPointer();
    this.#stackToDest("D"); // D=M[SP]
    this.#cCommand("D", comp, undefined); // D = comp (このcompではDが使われているので、上書きしているようにみえるが問題ない)
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

  #compare(jump: string): void {
    // false: 0
    // true: -1
    this.#decrementStackPointer();
    this.#stackToDest("D"); // D=M[SP]

    this.#decrementStackPointer();
    this.#stackToDest("A"); // A=M[SP]

    this.#cCommand("D", "A-D", undefined); // D=A-D
    const labelEq = this.#jump("D", jump); // D;jump

    this.#compToStack("0"); // M[SP]=0
    const labelNe = this.#jump("0", "JMP"); // 0;JMP
    this.#lCommand(labelEq); // (labelEq)

    this.#compToStack("-1"); // M[SP]=-1
    this.#lCommand(labelNe); // (labelNe)

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

  #lCommand(label: string): void {
    this.assemblies.push(`(${label})`);
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
    this.#cCommand("M", comp, undefined); // M[SP] = comp
  }

  #jump(comp: string, jump: string) {
    const label = this.#newLabel();
    this.#aCommand(label); // @label
    this.#cCommand(undefined, comp, jump);
    return label;
  }

  #newLabel(): string {
    this.labelNumber += 1;
    return `LABEL${this.labelNumber}`;
  }

  #push(segment: SEGMENT, index: number) {
    if (segment === "constant") {
      this.#aCommand(index.toString()); // @index
      this.#cCommand("D", "A", undefined); // D=A
      this.#compToStack("D"); // M[SP]=D
    } else if (segment === "local") {
      // @(local + index)
      // D=M[local + index]
      // @SP
      // M[SP]=D

      // load segment
      this.#aCommand(index.toString()); // A=index
      this.#cCommand("D", "A", undefined); // D=A
      this.#cCommand("A", "LCL", undefined); // A=LCL
      this.#cCommand("A", "M", undefined); // A=M[LCL]
      this.#cCommand("A", "D+A", undefined); // A=index+LCL

      // load value in segment
      this.#cCommand("D", "M", undefined); // D=M[index+LCL]

      // assign value to sp
      this.#compToStack("D");
    }
    this.#incrementStackPointer();
  }
}

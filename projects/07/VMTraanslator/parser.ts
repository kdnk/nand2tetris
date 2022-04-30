import { readAllSync } from "https://deno.land/std@0.114.0/streams/conversion.ts";

type COMMAND_TYPES =
  | "C_ARITHMETIC"
  | "C_PUSH"
  | "C_POP"
  | "C_LABEL"
  | "C_GOTO"
  | "C_IF"
  | "C_FUNCTION"
  | "C_RETURN"
  | "C_CALL";

export class Parser {
  commands: string[] = [];
  currentCommandIndex: number = 0;

  constructor(fileName: string) {
    console.log("[parser.ts:3] fileName: ", fileName);
    const file = Deno.openSync(fileName);
    try {
      const decoder = new TextDecoder("utf-8");
      const text = decoder.decode(readAllSync(file));
      // console.log("[parser.ts:24] text: ", text);
      this.commands = text.split(/\r?\n/).filter((line) => {
        if (line.startsWith("//")) {
          return false;
        } else if (line === "") {
          return false;
        } else {
          return true;
        }
      });
    } finally {
      Deno.close(file.rid);
    }
  }

  hasMoreCommands(): boolean {
    return !!this.commands[this.currentCommandIndex];
  }

  advance(): void {
    if (this.hasMoreCommands()) {
      this.currentCommandIndex += 1;
    }
  }

  commandType(): COMMAND_TYPES {
    if (this.#currentCommand()?.startsWith("pop")) {
      return "C_POP";
    } else if (this.#currentCommand()?.startsWith("push")) {
      return "C_PUSH";
    }
    return "C_ARITHMETIC";
  }

  arg1(): string | undefined {
    if (this.commandType() === "C_RETURN") {
      return;
    }
    if (this.commandType() === "C_POP") {
      return this.#currentCommand()?.split(" ")[1];
    }
    if (this.commandType() === "C_PUSH") {
      return this.#currentCommand()?.split(" ")[1];
    }
    if (this.commandType() === "C_ARITHMETIC") {
      return this.#currentCommand();
    }
  }

  arg2(): string | undefined {
    if (this.commandType() === "C_POP") {
      return this.#currentCommand()?.split(" ")[2];
    }
    if (this.commandType() === "C_PUSH") {
      return this.#currentCommand()?.split(" ")[2];
    }
    if (this.commandType() === "C_FUNCTION") {
      return this.#currentCommand()?.split(" ")[2];
    }
    if (this.commandType() === "C_CALL") {
      return this.#currentCommand()?.split(" ")[2];
    }
  }

  #currentCommand(): string | undefined {
    return this.commands[this.currentCommandIndex];
  }
}

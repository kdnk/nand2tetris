import { readAllSync } from "https://deno.land/std@0.114.0/streams/conversion.ts";

type COMMAND_TYPES = "A_COMMAND" | "C_COMMAND" | "L_COMMAND";

export class Parser {
  commands: string[] = [];
  currentCommandIndex: number = 0;

  constructor(fileName: string) {
    const file = Deno.openSync(fileName);
    try {
      const decoder = new TextDecoder("utf-8");
      const text = decoder.decode(readAllSync(file));
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

  advance() {
    if (this.hasMoreCommands()) {
      this.currentCommandIndex += 1;
    }
  }

  commandType(): COMMAND_TYPES {
    const currentCommand = this.commands[this.currentCommandIndex];
    if (currentCommand.indexOf("@") === 0) {
      return "A_COMMAND";
    } else if (currentCommand.indexOf("(") === 0) {
      return "L_COMMAND";
    } else {
      return "C_COMMAND";
    }
  }

  symbol(): string | undefined {
    const currentCommand = this.commands[this.currentCommandIndex];
    if (this.commandType() === "C_COMMAND") {
      return;
    } else if (this.commandType() === "A_COMMAND") {
      return currentCommand.substring(1);
    } else if (this.commandType() === "L_COMMAND") {
      return currentCommand.substring(1, currentCommand.length - 1);
    }
  }

  dest() {
  }

  comp() {
  }

  jump() {
  }
}

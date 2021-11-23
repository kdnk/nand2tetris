import { readAllSync } from "https://deno.land/std@0.114.0/streams/conversion.ts";

const COMMAND_TYPES = {
  A_COMMAND: "A_COMMAND",
  C_COMMAND: "C_COMMAND",
  L_COMMAND: "L_COMMAND",
};

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

  commandType(command: string) {
    if (command.indexOf("@") === 0) {
      return COMMAND_TYPES.A_COMMAND;
    } else if (command.indexOf("(") === 0) {
      return COMMAND_TYPES.L_COMMAND;
    } else {
      return COMMAND_TYPES.C_COMMAND;
    }
  }

  symbol() {
  }

  dest() {
  }

  comp() {
  }

  jump() {
  }
}

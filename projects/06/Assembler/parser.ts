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
    if (this.#currentCommand().indexOf("@") === 0) {
      return "A_COMMAND";
    } else if (this.#currentCommand().indexOf("(") === 0) {
      return "L_COMMAND";
    } else {
      return "C_COMMAND";
    }
  }

  symbol(): string | undefined {
    if (this.commandType() === "C_COMMAND") {
      return;
    } else if (this.commandType() === "A_COMMAND") {
      return this.#currentCommand().substring(1);
    } else if (this.commandType() === "L_COMMAND") {
      return this.#currentCommand().substring(
        1,
        this.#currentCommand().length - 1,
      );
    }
  }

  dest(): string | undefined {
    if (this.commandType() === "C_COMMAND") {
      if (this.#currentCommand().indexOf("=") < 0) {
        return "null";
      } else {
        const [dest, _rest] = this.#currentCommand().split("=");
        return dest;
      }
    } else {
      return;
    }
  }

  comp() {
    if (this.commandType() === "C_COMMAND") {
      if (this.#currentCommand().indexOf(";") < 0) {
        if (this.#currentCommand().indexOf("=") < 0) {
          // ex. A
          return this.#currentCommand();
        } else {
          // ex. D=A
          const [_dest, comp] = this.#currentCommand().split("=");
          return comp;
        }
      } else {
        if (this.#currentCommand().indexOf("=") < 0) {
          // ex. A;JGT
          const [comp, _jump] = this.#currentCommand().split(";");
          return comp;
        } else {
          // ex. D=A;JGT
          const [_dest, comp, _jump] = this.#currentCommand().split(/=|;/);
          return comp;
        }
      }
    } else {
      return;
    }
  }

  jump() {
    if (this.commandType() === "C_COMMAND") {
      if (this.#currentCommand().indexOf(";") < 0) {
        return "null";
      } else {
        const [_rest, jump] = this.#currentCommand().split(";");
        return jump;
      }
    } else {
      return;
    }
  }

  #currentCommand() {
    return this.commands[this.currentCommandIndex];
  }
}

import { readAllSync } from "https://deno.land/std@0.114.0/streams/conversion.ts";

import { Comp, Dest, isComp, isDest, isJump, Jump } from "./code.ts";

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
      }).map((line) => {
        const program = line.split(" ").filter((chank) => (!!chank))[0];
        return program;
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

  symbol() {
    if (this.commandType() === "C_COMMAND") {
      throw new Error("Don't call `symbol` for C_COMMAND.");
    } else if (this.commandType() === "A_COMMAND") {
      return this.#currentCommand().substring(1);
    } else if (this.commandType() === "L_COMMAND") {
      return this.#currentCommand().substring(
        1,
        this.#currentCommand().length - 1,
      );
    } else {
      throw new Error();
    }
  }

  dest(): Dest {
    if (this.commandType() === "C_COMMAND") {
      if (this.#currentCommand().indexOf("=") < 0) {
        return "null";
      } else {
        const [dest, _rest] = this.#currentCommand().split("=");
        return this.#validatedDest(dest);
      }
    } else {
      throw new Error();
    }
  }

  comp(): Comp {
    if (this.commandType() === "C_COMMAND") {
      if (this.#currentCommand().indexOf(";") < 0) {
        if (this.#currentCommand().indexOf("=") < 0) {
          // ex. A
          const comp = this.#currentCommand();
          return this.#validatedComp(comp);
        } else {
          // ex. D=A
          const [_dest, comp] = this.#currentCommand().split("=");
          return this.#validatedComp(comp);
        }
      } else {
        if (this.#currentCommand().indexOf("=") < 0) {
          // ex. A;JGT
          const [comp, _jump] = this.#currentCommand().split(";");
          return this.#validatedComp(comp);
        } else {
          // ex. D=A;JGT
          const [_dest, comp, _jump] = this.#currentCommand().split(/=|;/);
          return this.#validatedComp(comp);
        }
      }
    } else {
      throw new Error();
    }
  }

  jump(): Jump {
    if (this.commandType() === "C_COMMAND") {
      if (this.#currentCommand().indexOf(";") < 0) {
        return "null";
      } else {
        const [_rest, jump] = this.#currentCommand().split(";");
        return this.#validatedJump(jump);
      }
    } else {
      throw new Error();
    }
  }

  #currentCommand() {
    return this.commands[this.currentCommandIndex];
  }

  #validatedComp(comp: string): Comp {
    if (isComp(comp)) {
      return comp;
    } else {
      throw new Error(`${comp} isn't in Comp`);
    }
  }

  #validatedJump(jump: string): Jump {
    if (isJump(jump)) {
      return jump;
    } else {
      throw new Error(`${jump} isn't in Jump`);
    }
  }

  #validatedDest(dest: string): Dest {
    if (isDest(dest)) {
      return dest;
    } else {
      throw new Error(`${dest} isn't in Dest`);
    }
  }
}

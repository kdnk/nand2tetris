import { readAll } from "https://deno.land/std@0.114.0/streams/conversion.ts";

const COMMAND_TYPES = {
  A_COMMAND: "A_COMMAND",
  C_COMMAND: "C_COMMAND",
  L_COMMAND: "L_COMMAND",
};

export async function initialize() {
  const fileName = Deno.args[0];
  const file = await Deno.open(fileName);
  const decoder = new TextDecoder("utf-8");
  const text = decoder.decode(await readAll(file));
  console.log(text);
}

function hasMoreCommands() {
}

function advance() {
}

export function commandType(command: string) {
  if (command.indexOf("@") === 0) {
    return COMMAND_TYPES.A_COMMAND;
  } else if (command.indexOf("(") === 0) {
    return COMMAND_TYPES.L_COMMAND;
  } else {
    return COMMAND_TYPES.C_COMMAND;
  }
}

function symbol() {
}

function dest() {
}

function comp() {
}

function jump() {
}

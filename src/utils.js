import { unlink } from "fs/promises";

export const INITIAL_SESSION = {
  messages: [],
};

export async function removeFile(path) {
  try {
    await unlink(path);
  } catch (error) {
    console.log("Error while removing file: " + error.message);
  }
}

export function checkIfTextMessageToBot(message, botUserName) {
  return !!message.match(`@${botUserName}`);
}

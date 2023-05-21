import config from "config";
import { Telegraf, session, Markup } from "telegraf";
import { message } from "telegraf/filters";
import {
  commands,
  createImage,
  gopnic,
  newSession,
  professor,
  snob,
  start,
  voice,
} from "./commands.js";
import { COMANDS } from "./const.js";
import { onText, onVoice } from "./messages.js";
import { openAI } from "./openAI.js";

const bot = new Telegraf(config.get("TELEGRAM_API_KEY"));

bot.use(session());

bot.command(COMANDS.START, start);
bot.command(COMANDS.COMMANDS, commands);

bot.action(COMANDS.NEW, newSession);
bot.command(COMANDS.NEW, newSession);

bot.action(COMANDS.VOICE, voice);
bot.command(COMANDS.VOICE, voice);

bot.action(COMANDS.CREATE_IMAGE, createImage);
bot.command(COMANDS.CREATE_IMAGE, createImage);

bot.action(COMANDS.GOPNIC, gopnic);
bot.command(COMANDS.GOPNIC, gopnic);

bot.action(COMANDS.SNOB, snob);
bot.command(COMANDS.SNOB, snob);

bot.action(COMANDS.PROFESSOR, professor);
bot.command(COMANDS.PROFESSOR, professor);

bot.on(message("text"), onText);

bot.on(message("voice"), onVoice);

bot.launch();

openAI.createImage("dog watching cat killing man");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

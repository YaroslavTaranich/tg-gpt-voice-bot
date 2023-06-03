import { Markup } from "telegraf";
import { INITIAL_SESSION, COMANDS, MODE, IMAGE_MODE } from "./const.js";
import { code } from "telegraf/format";
import { openAI } from "./openAI.js";

const commandButtons = Markup.inlineKeyboard([
  [Markup.button.callback("Новая сессия", COMANDS.NEW)],
  [Markup.button.callback("Голос в текст", COMANDS.VOICE)],
  [Markup.button.callback("Создать картинку", COMANDS.CREATE_IMAGE)],
  [Markup.button.callback("Режим работы с картинками", COMANDS.IMAGE_COMMANDS)],
  [Markup.button.callback("Отвечать как гопник", COMANDS.GOPNIC)],
  [Markup.button.callback("Отвечать как сноб", COMANDS.SNOB)],
  [Markup.button.callback("Отвечать как профессор", COMANDS.PROFESSOR)],
]);

const imageCommandButtons = Markup.inlineKeyboard([
  [Markup.button.callback("Создавать вариации изображения", COMANDS.VARIATON)],
  [
    Markup.button.callback(
      "Изменять изображение по описанию",
      COMANDS.EDIT_IMAGE
    ),
  ],
]);

export const start = async (ctx) => {
  ctx.session = INITIAL_SESSION;
  ctx.session.mode = MODE.CHAT;
  await ctx.reply(
    code("Запиши голосовуху или отправь сообщение для общения с ГПТ!"),
    commandButtons
  );
};

export const commands = async (ctx) => {
  await ctx.reply(
    code(
      "Запиши голосовуху, отправь сообщение или картинку для общения с ГПТ!"
    ),
    commandButtons
  );
};

export const imageCommands = async (ctx) => {
  await ctx.reply(
    code(
      "Запиши голосовуху, отправь сообщение или картинку для общения с ГПТ!"
    ),
    imageCommandButtons
  );
  await ctx.deleteMessage();
};

export const newSession = async (ctx) => {
  ctx.session = INITIAL_SESSION;
  ctx.session.mode = MODE.CHAT;
  await ctx.reply(
    code(
      "Начал новую сессию! Запиши голосовуху или отправь сообщение для общения с ГПТ!"
    )
  );
  await ctx.deleteMessage();
};

export const voice = async (ctx) => {
  ctx.session = INITIAL_SESSION;
  ctx.session.mode = MODE.VOICE_TO_TEXT;
  await ctx.reply(
    code("В этом режиме я просто буду переводить голосовухи в текст!")
  );
  await ctx.deleteMessage();
};

export const createImage = async (ctx) => {
  ctx.session = INITIAL_SESSION;
  ctx.session.mode = MODE.CREATE_IMAGE;
  await ctx.reply(
    code("В этом режиме я буду создавать картинки по твоему запросу!")
  );
  await ctx.deleteMessage();
};

export const gopnic = async (ctx) => {
  ctx.session = INITIAL_SESSION;
  ctx.session.mode = MODE.CHAT;
  ctx.session.messages.push({
    role: openAI.roles.SYSTEM,
    content: "Отвечай как типичный гопник",
  });
  await ctx.reply(code("Теперь я буду отвечать как чат ГОПОТА!"));
  await ctx.deleteMessage();
};

export const snob = async (ctx) => {
  ctx.session = INITIAL_SESSION;
  ctx.session.mode = MODE.CHAT;
  ctx.session.messages.push({
    role: openAI.roles.SYSTEM,
    content: "Отвечай как самый настоящий сноб",
  });
  await ctx.reply(code("Теперь я буду отвечать как сноб!"));
  await ctx.deleteMessage();
};

export const professor = async (ctx) => {
  ctx.session = INITIAL_SESSION;
  ctx.session.mode = MODE.CHAT;
  ctx.session.messages.push({
    role: openAI.roles.SYSTEM,
    content: "Отвечай как очень старый и очень умный профессор математики",
  });
  await ctx.reply(code("Теперь я буду отвечать как профессор!"));
  await ctx.deleteMessage();
};

export const variation = async (ctx) => {
  ctx.session = INITIAL_SESSION;
  ctx.session.image_mode = IMAGE_MODE.VARIATON;
  await ctx.reply(code("Теперь я буду присылать вариации изображения!"));
  await ctx.deleteMessage();
};

export const editImageByPrompt = async (ctx) => {
  ctx.session = INITIAL_SESSION;
  ctx.session.image_mode = IMAGE_MODE.EDIT_BY_PROMPT;
  await ctx.reply(code("Теперь я буду изменять изображение по описанию!"));
  await ctx.deleteMessage();
};

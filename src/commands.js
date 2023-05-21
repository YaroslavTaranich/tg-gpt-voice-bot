import { Markup } from "telegraf";
import { INITIAL_SESSION, COMANDS, MODE } from "./const.js";
import { code } from "telegraf/format";
import { openAI } from "./openAI.js";

export const start = async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply(
    code("Запиши голосовуху или отправь сообщение для общения с ГПТ!"),
    Markup.inlineKeyboard([
      [Markup.button.callback("Новая сессия", COMANDS.NEW)],
      [Markup.button.callback("Голос в текст", COMANDS.VOICE)],
      [Markup.button.callback("Отвечать как гопник", COMANDS.GOPNIC)],
      [Markup.button.callback("Отвечать как сноб", COMANDS.SNOB)],
      [Markup.button.callback("Отвечать как профессор", COMANDS.PROFESSOR)],
    ])
  );
};

export const newSession = async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply(
    code(
      "Начал новую сессию! Запиши голосовуху или отправь сообщение для общения с ГПТ!"
    )
  );
};

export const voice = async (ctx) => {
  ctx.session = INITIAL_SESSION;
  ctx.session.mode = MODE.VOICE_TO_TEXT;
  await ctx.reply(
    code("В этом режиме я просто буду переводить голосовухи в текст!")
  );
};

export const gopnic = async (ctx) => {
  ctx.session = INITIAL_SESSION;
  ctx.session.messages.push({
    role: openAI.roles.SYSTEM,
    content: "Отвечай как типичный гопник",
  });
  await ctx.reply(code("Теперь я буду отвечать как чат ГОПОТА!"));
};

export const snob = async (ctx) => {
  ctx.session = INITIAL_SESSION;
  ctx.session.messages.push({
    role: openAI.roles.SYSTEM,
    content: "Отвечай как самый настоящий сноб",
  });
  await ctx.reply(code("Теперь я буду отвечать как сноб!"));
};

export const professor = async (ctx) => {
  ctx.session = INITIAL_SESSION;
  ctx.session.messages.push({
    role: openAI.roles.SYSTEM,
    content: "Отвечай как очень старый и очень умный профессор математики",
  });
  await ctx.reply(code("Теперь я буду отвечать как профессор!"));
};

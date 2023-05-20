import config from "config";
import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { code } from "telegraf/format";
import { ogg } from "./ogg.js";
import { openAI } from "./openAI.js";
import { removeFile } from "./utils.js";

const INITIAL_SESSION = {
  messages: [],
};

const bot = new Telegraf(config.get("TELEGRAM_API_KEY"));

bot.use(session());

bot.command("start", async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply(
    code("Запиши голосовуху или отправь сообщение для общения с ГПТ!")
  );
});

bot.command("new", async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply(
    code(
      "Начал новую сессию! Запиши голосовуху или отправь сообщение для общения с ГПТ!"
    )
  );
});

bot.on(message("text"), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;
  const userId = ctx.message.from.id;
  const text = ctx.message.text;
  try {
    await ctx.reply(code("Оки-доки, ждём ответа от ГПТ!"));

    ctx.session.messages.push({ role: openAI.roles.USER, content: text });

    const response = await openAI.chat(ctx.session.messages);

    ctx.session.messages.push({
      role: openAI.roles.ASSISTANT,
      content: response.content,
    });

    ctx.reply(response.content);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      ctx.reply(
        "УПС! Ошибка при использовании ГПТ. Превышено количество запросов. Сорян"
      );
    }
    console.error("Error while vioce message", error.message);
  }
});

bot.on(message("voice"), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;
  const userId = ctx.message.from.id;
  try {
    await ctx.reply(code("Оки-доки, ждём ответа от ГПТ!"));
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);

    const oggPath = await ogg.create(link.href, userId);
    console.log("File saved: " + oggPath);

    const mp3Path = await ogg.toMp3(oggPath, userId);
    console.log("File converted to mp3: " + mp3Path);

    const text = await openAI.transcription(mp3Path);
    removeFile(mp3Path);
    console.log("File converted to text: " + text);
    await ctx.reply(code("Ты спросил: " + text));

    ctx.session.messages.push({ role: openAI.roles.USER, content: text });
    const response = await openAI.chat(ctx.session.messages);

    ctx.session.messages.push({
      role: openAI.roles.ASSISTANT,
      content: response.content,
    });

    ctx.reply(response.content);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      ctx.reply(
        "УПС! Ошибка при использовании ГПТ. Превышено количество запросов. Сорян"
      );
    }
    console.error("Error while vioce message", error.message);
  }
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

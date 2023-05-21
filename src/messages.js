import { Markup } from "telegraf";
import { INITIAL_SESSION, COMANDS, MODE } from "./const.js";
import { code } from "telegraf/format";
import { openAI } from "./openAI.js";
import { ogg } from "./ogg.js";
import { removeFile } from "./utils.js";

export const onText = async (ctx) => {
  ctx.session ??= INITIAL_SESSION;
  if (ctx.session.mode === MODE.VOICE_TO_TEXT) {
    await ctx.reply(
      code(
        "Включен режим перевода голосовух в текст, запиши голосовое сообщение или начни новую сессию чата"
      ),
      Markup.inlineKeyboard([Markup.button.callback("Новая сессия", `new`)])
    );
  } else {
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
  }
};

export const onVoice = async (ctx) => {
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
    await ctx.reply(
      code(
        ctx.session.mode === MODE.CHAT ? "Ты спросил: " : "Pacшифровка: ",
        text
      )
    );

    if (ctx.session.mode === MODE.CHAT) {
      ctx.session.messages.push({ role: openAI.roles.USER, content: text });
      const response = await openAI.chat(ctx.session.messages);

      ctx.session.messages.push({
        role: openAI.roles.ASSISTANT,
        content: response.content,
      });

      ctx.reply(response.content);
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      ctx.reply(
        "УПС! Ошибка при использовании ГПТ. Превышено количество запросов. Сорян"
      );
    }
    console.error("Error while vioce message", error.message);
  }
};

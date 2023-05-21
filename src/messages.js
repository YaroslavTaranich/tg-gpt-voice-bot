import { Markup } from "telegraf";
import { INITIAL_SESSION, COMANDS, MODE, IMAGE_MODE } from "./const.js";
import { code } from "telegraf/format";
import { openAI } from "./openAI.js";
import { ogg } from "./ogg.js";
import { removeFile } from "./utils.js";
import { jpg } from "./jpg.js";

export const onText = async (ctx) => {
  ctx.session ??= INITIAL_SESSION;
  const text = ctx.message.text;

  if (ctx.session.pngPath) {
    try {
      const response = await openAI.editImage(ctx.session.pngPath, text);
      ctx.replyWithPhoto(response);
      return;
    } catch (error) {
      console.error("Error while editing photo by prompt: " + error.message);
      await ctx.reply(code("УПС! ошибка обращения к ГПТ! Попробуй позже"));
      await ctx.reply(code("Начал новую сессию!"));
      ctx.session = INITIAL_SESSION;
    } finally {
      ctx.session.pngPath = null;
    }
  } else {
    switch (ctx.session.mode) {
      case MODE.VOICE_TO_TEXT:
        await ctx.reply(
          code(
            "Включен режим перевода голосовух в текст, запиши голосовое сообщение или начни новую сессию чата"
          ),
          Markup.inlineKeyboard([Markup.button.callback("Новая сессия", `new`)])
        );
        break;
      case MODE.CHAT:
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
          console.error("Error while text message", error.message);
        }
        break;
      case MODE.CREATE_IMAGE:
        try {
          await ctx.reply(code("Оки-доки, создаём картинку с помощью ГПТ!"));

          const response = await openAI.createImage(text);

          ctx.replyWithPhoto(response);
        } catch (error) {
          if (error.response && error.response.status === 429) {
            ctx.reply(
              "УПС! Ошибка при использовании ГПТ. Превышено количество запросов. Сорян"
            );
          }
          console.error("Error while prompt message", error.message);
        }
        break;
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

    switch (ctx.session.mode) {
      case MODE.CHAT:
        await ctx.reply(code("Ты спросил: " + text));
        break;
      case MODE.VOICE_TO_TEXT:
        await ctx.reply(code("Pacшифровка: " + text));
        break;
      case MODE.CREATE_IMAGE:
        await ctx.reply(code("Картинка по запросу: " + text));
        break;
    }

    if (ctx.session.mode === MODE.CHAT) {
      ctx.session.messages.push({ role: openAI.roles.USER, content: text });
      const response = await openAI.chat(ctx.session.messages);

      ctx.session.messages.push({
        role: openAI.roles.ASSISTANT,
        content: response.content,
      });

      ctx.reply(response.content);
    }

    if (ctx.session.mode === MODE.CREATE_IMAGE) {
      const response = await openAI.createImage(text);

      ctx.replyWithPhoto(response);
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      ctx.reply(
        code(
          "УПС! Ошибка при использовании ГПТ. Превышено количество запросов. Сорян"
        )
      );
    }
    console.error("Error while vioce message", error.message);
  }
};

export const onPhoto = async (ctx) => {
  ctx.session ??= INITIAL_SESSION;
  const userId = ctx.message.from.id;
  try {
    const link = await ctx.telegram.getFileLink(
      ctx.message.photo[ctx.message.photo.length - 1].file_id
    );
    const jpgPath = await jpg.create(link.href, userId);
    const pngPath = await jpg.toPng(jpgPath, userId);
    await ctx.reply(code("Создаём вариацию для фото с помощью ГПТ..."));
    removeFile(jpgPath);
    if (ctx.session.image_mode === IMAGE_MODE.VARIATON) {
      const response = await openAI.createImageVariation(pngPath);
      await ctx.replyWithPhoto(response);
    }
    if (ctx.session.image_mode === IMAGE_MODE.EDIT_BY_PROMPT) {
      console.log("in photo handler", pngPath);
      ctx.session.pngPath = pngPath;
      ctx.reply(code("Напиши описание для изменеия фото"));
    }
  } catch (error) {
    await ctx.reply(code("Не удалось создать вариацию, попробуй позже!"));
    console.log("Error while photo message: " + error.message);
  }
};

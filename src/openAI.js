import { Configuration, OpenAIApi } from "openai";
import config from "config";
import { createReadStream } from "fs";

class OpenAI {
  roles = {
    USER: "user",
    SYSTEM: "system",
    ASSISTANT: "assistant",
  };

  constructor(apiKey) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async transcription(filePath) {
    try {
      const response = await this.openai.createTranscription(
        createReadStream(filePath),
        "whisper-1"
      );
      return response.data.text;
    } catch (error) {
      console.log("Error while transcription: " + error.message);
      throw error;
    }
  }

  async createImage(prompt) {
    try {
      const response = await this.openai.createImage({
        prompt,
        n: 1,
        size: "1024x1024",
      });
      return response.data.data[0].url;
    } catch (error) {
      console.log("Error while creating image with openAI: " + error.message);
    }
  }

  async editImage(pngPath, prompt) {
    try {
      // @todo fix if
      const response = await this.openai.createImageEdit(
        createReadStream(pngPath),
        prompt
      );
      return response.data.data[0].url;
    } catch (error) {
      console.log("Error while creating image with openAI: " + error.message);
      throw error;
    }
  }

  async createImageVariation(pngPath) {
    try {
      const response = await this.openai.createImageVariation(
        createReadStream(pngPath),
        1,
        "1024x1024"
      );
      return response.data.data[0].url;
    } catch (error) {
      console.log("Error while editing image with openAI: " + error.message);
    }
  }

  async chat(messages) {
    try {
      const completion = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
      });

      return completion.data.choices[0].message;
    } catch (error) {
      console.log("Error while using chat: " + error.message);
      throw error;
    }
  }
}

export const openAI = new OpenAI(config.get("OPENAI_API_KEY"));

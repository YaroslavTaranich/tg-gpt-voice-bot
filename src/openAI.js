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

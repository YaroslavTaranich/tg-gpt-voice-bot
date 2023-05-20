import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import installer from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { removeFile } from "./utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

class OggConverter {
  constructor() {
    ffmpeg.setFfmpegPath(installer.path);
  }

  toMp3(input, output) {
    try {
      const outputPath = resolve(dirname(input), `${output}.mp3`);
      return new Promise((resolve, reject) => {
        ffmpeg(input)
          .inputOption("-t 30")
          .output(outputPath)
          .on("end", () => {
            removeFile(input);
            resolve(outputPath);
          })
          .on("error", (error) => resolve(error.message))
          .run();
      });
    } catch (e) {
      console.log("Error while creating mp3 file " + e.message);
    }
  }

  async create(url, fileName) {
    try {
      const oggPath = resolve(__dirname, "../voice", `${fileName}.ogg`);
      const response = await axios({
        method: "get",
        url,
        responseType: "stream",
      });
      return new Promise((resolve) => {
        const stream = fs.createWriteStream(oggPath);
        response.data.pipe(stream);
        stream.on("finish", () => resolve(oggPath));
      });
    } catch (e) {
      console.log("Error while saving ogg file " + e.message);
    }
  }
}

export const ogg = new OggConverter();

import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import axios from "axios";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));

class Jpg {
  constructor() {}

  async create(url, fileName) {
    try {
      const jpgPath = resolve(__dirname, `../image/${fileName}.jpg`);
      const response = await axios({
        method: "get",
        url,
        responseType: "stream",
      });
      return new Promise((resolve) => {
        const stream = fs.createWriteStream(jpgPath);
        response.data.pipe(stream);
        stream.on("finish", () => resolve(jpgPath));
      });
    } catch (error) {
      console.log("Error while creating JPG on server: " + error.message);
    }
  }

  async toPng(input, output) {
    try {
      const pngPath = resolve(__dirname, `../image/${output}.png`);
      await sharp(input).resize({ width: 1024, height: 1024 }).toFile(pngPath);
      return pngPath;
    } catch (error) {
      console.log("Error while converting to PNG: " + error.message);
    }
  }
}

export const jpg = new Jpg();

const sharp = require("sharp");
const axios = require("axios");

exports.generate = async (imageUrl, size) => {
  const response = await axios(imageUrl, {responseType: "arraybuffer"});
  const buffer = Buffer.from(response.data, "utf-8");
  return await sharp(buffer)
      .resize({width: size})
      .png()
      .toBuffer();
};

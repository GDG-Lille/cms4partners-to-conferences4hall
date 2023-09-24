const {Storage} = require("@google-cloud/storage");

exports.save = async (c4hId, companyId, size, bufferImage) => {
  const path = `${c4hId}/partners/${companyId}/${size}.png`;
  const storage = new Storage();
  await storage
      .bucket("conferences4hall")
      .file(path)
      .save(bufferImage, {
        public: true,
        predefinedAcl: "publicRead",
      });
  return `https://storage.googleapis.com/conferences4hall/${path}`;
};

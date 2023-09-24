const {update, remove} = require("./c4h-dao");
const {save} = require("./image-dao");
const {generate} = require("./image-source");
const {getAddress} = require("./gmap-source");

exports.save = async (companyId, event, context) => {
  if (event.public == false) {
    console.log("The partner isn't public.");
    return;
  }
  if (event.edition != context.year) {
    console.log(`Partner is registered for another edition (${context.year}).`);
    return;
  }
  if (event.status.paid != "done") {
    console.log("Partner didn't paid yet.");
    return;
  }
  if (event.logoUrl == "" ||
    event.logoUrl == undefined ||
    event.logoUrl == null) {
    console.log("Partner doesn't have a logo.");
    return;
  }
  if (event.siteUrl == "" ||
    event.siteUrl == undefined ||
    event.siteUrl == null) {
    console.log("Partner doesn't have a website.");
    return;
  }
  if (event.archived == true) {
    await remove(context.c4hId, companyId);
  } else {
    const media = {
      svg: event.logoUrl,
      pngs: {
        _250: await _genPng(context.c4hId, companyId, event.logoUrl, 250),
        _500: await _genPng(context.c4hId, companyId, event.logoUrl, 500),
        _1000: await _genPng(context.c4hId, companyId, event.logoUrl, 1000),
      },
    };
    const address = await getAddress(context.geocodeApiKey, event.address);
    await update(context.c4hId, companyId, event, address, media);
  }
};

// eslint-disable-next-line require-jsdoc
async function _genPng(c4hId, companyId, logoUrl, size) {
  const image = await generate(logoUrl, size);
  return await save(c4hId, companyId, size, image);
}

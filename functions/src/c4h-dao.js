const {firestore} = require("firebase-admin");
const {getFirestore} = require("firebase-admin/firestore");

exports.update = async (c4hId, companyId, event, address) => {
  const db = getFirestore();
  const docRef = db.collection("conferences4hall")
      .doc(c4hId)
      .collection("companies")
      .doc(companyId);
  const hasTwitter = event.twitterAccount == "" ||
      event.twitterAccount == undefined;
  const hasLinkedin = event.linkedinAccount == "" ||
      event.linkedinAccount == undefined;
  const hasSchemaSiteUrl = event.siteUrl.startsWith("https://");
  await docRef.set({
    id: companyId,
    name: event.name,
    description: event.description ? event.description : "",
    logoUrl: event.logoUrl,
    siteUrl: hasSchemaSiteUrl ? event.siteUrl : `https://${event.siteUrl}`,
    twitterUrl: hasTwitter ? null : event.twitterAccount,
    twitterMessage: event.twitter ? event.twitter : null,
    linkedinUrl: hasLinkedin ? null : event.linkedinAccount,
    linkedinMessage: event.linkedin ? event.linkedin : null,
    address: address ? address : {
      formatted: [event.address, `${event.zipCode} ${event.city}`],
      address: event.address,
      country: "",
      countryCode: "",
      city: event.city,
      lat: event.location.lat,
      lng: event.location.lng,
    },
    sponsoring: event.sponsoring,
    wldId: event.wldId ? event.wldId : null,
    creationDate: firestore.FieldValue.serverTimestamp(),
  });
};

exports.remove = async (c4hId, companyId) => {
  const db = getFirestore();
  await db.collection("conferences4hall")
      .doc(c4hId)
      .collection("companies")
      .doc(companyId)
      .delete();
};

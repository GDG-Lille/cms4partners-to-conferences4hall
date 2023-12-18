const {initializeApp} = require("firebase-admin/app");
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {save} = require("./save-event-flow");
const {defineString, defineSecret} = require("firebase-functions/params");

const year = defineString("YEAR");
const c4hId = defineString("CONFERENCE4HALL_ID");
const GEOCODE_API_KEY = defineSecret("GEOCODE_API_KEY");

initializeApp();

exports.updatePartnerToC4H = onDocumentUpdated(
    {
      document: `companies-2024/{companyId}`,
      secrets: [GEOCODE_API_KEY],
    },
    async (event) => {
      const newValue = event.data.after.data();
      await save(event.data.after.id, newValue, {
        c4hId: c4hId.value(),
        year: year.value(),
        geocodeApiKey: GEOCODE_API_KEY.value(),
      });
      console.log(newValue);
    },
);

// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
// const {logger} = require("firebase-functions");
// const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
// const logger = require("firebase-functions/logger");

// The Firebase Admin SDK to access Firestore.
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

exports.checkForMatch =
  onDocumentUpdated("games/{gameCode}/cards/{docID}", async (event) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = event.data.after.data();

    // access a particular field as you would any JS property
    const numMatches = newValue.numMatches;

    const gameCode = event.params.gameCode;

    // Get the document reference
    const doc = await db.doc("games/"+gameCode).get();

    // Get the document snapshot
    const numPlayers = doc.data().numUsers;

    if (numMatches == numPlayers) {
      return db.doc("games/"+gameCode).set({
        startGame: 0,
      }, {
        merge: true,
      });
    } else {
      return null;
    }
  });

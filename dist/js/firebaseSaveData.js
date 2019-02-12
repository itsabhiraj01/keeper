console.log("firebaseSaveData.js called");
// var firebase = firebase.database();
var noteRef = firebase.database().ref('notes');

// Save data to firebase
(function () {
    console.log("pushing to firebase")
    noteRef.push({ name: name, language: language, tag: tag, note: note, date: date});
}());
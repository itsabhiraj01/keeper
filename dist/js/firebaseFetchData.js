console.log("firebaseFetchData.js called");
// var firebase = firebase.database();
var noteRef = firebase.database().ref('notes/');
var count = 0;
noteKey = [];
noteData = [];
// Fetch data from firebase
(function () {
    console.log("fetching from firebase")
    // noteRef.push({ name: name, language: language, tag: tag, note: note, date: date});
    // var notes = noteRef.orderByChild('date');
    noteRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childKey = childSnapshot.key;
          noteKey.push(childKey);
          var childData = childSnapshot.val();
          noteData.push(childData)
          console.log("childKey : " , childKey);
          console.log("child Data : " , childData);
        });
      });
    console.log(noteData);
}());
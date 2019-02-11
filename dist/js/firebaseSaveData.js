console.log("firebaseSaveData.js called");
// var firebase = firebase.database();
var noteRef = firebase.database().ref('notes/');

var nameField = document.getElementById('add_name');
console.log("name : " + nameField.value);
var languageField = document.getElementById('add_language');
console.log("languageField : " + languageField.value);
var tagField = document.getElementById('add_tags');
console.log("tagField : " + tagField.value);
var noteField = document.getElementById('add_note');
console.log("noteField : " + noteField.value);

// Save data to firebase
(function () {
    var name = nameField.value;
    var language = languageField.value;
    var tag = tagField.value;
    var note = noteField.value;

    noteRef.push({ name: name,language: language, tag: tag, note: note});

    nameField.value = '';
    languageField.value = '';
    tagField.value = '';
    noteField = '';
}());
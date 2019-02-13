console.log("index.js called");
var name;
var language;
var tag;
var note;
var date;
var keyword;
var startDate;
var endDate;
var noteData, noteKey;
// var firebase;
var noteRef;

window.onload = function () {
    document.getElementById("search_note_submit_button").onclick = fetch_note;
    document.getElementById("add_note_submit_button").onclick = upload_note;
    document.getElementById("add_date").valueAsDate = new Date();
    document.getElementById("search_end_date").valueAsDate = new Date();

    // firebase = firebase.database();    
    noteRef = firebase.database().ref('notes');

    // tinymce.init({
    //     selector: '#add_note',
    //     // plugins: 'a11ychecker advcode formatpainter linkchecker media mediaembed pageembed permanentpen powerpaste tinycomments tinydrive tinymcespellchecker',
    //     // toolbar: 'a11ycheck code formatpainter insertfile pageembed permanentpen tinycomments',
    //     // tinycomments_mode: 'embedded',
    //     // tinycomments_author: 'Abhiraj'
    //  });

}

//Functon to Store data into firebase
function fetch_note() {
    var nameField = document.getElementById('search_name');
    var languageField = document.getElementById('search_language');
    var tagField = document.getElementById('search_tags');
    var keywordField = document.getElementById('search_keywords');
    var startDateField = document.getElementById('search_start_date');
    var endDateField = document.getElementById('search_end_date');

    name = nameField.value;
    language = languageField.value;
    tag = tagField.value;
    keyword = keywordField.value;
    startDate = startDateField.value;
    endDate = endDateField.value;

    var userDetails = ""
    if (name) userDetails += "Name : " + name + "<br />";
    if (language) userDetails += "Language : " + language + "<br />";
    if (tag) userDetails += "Tag : " + tag + "<br />";
    if (keyword) userDetails += "Keyword : " + keyword + "<br />";
    if (startDate) userDetails += "StartDate : " + startDate + "<br />";
    if (endDate) userDetails += "EndDate : " + endDate;

    function formValidation() {

        console.log("formValidation is initiated");

        if (!(nameField.value || languageField.value || tagField.value || keywordField.value || startDateField.value || endDateField.value)) {
            showAlert("search_note_alert", "alert-danger", null, "Form Validation Failed", null, "There must be atleast a single non empty field");
            return false;
        }
        //console.log("userDetails : " + userDetails);
        return true;
    }

    function clearFields() {
        console.log("clearFields is initiated");
        nameField.value = "";
        languageField.value = "";
        tagField.value = "";
        keywordField.value = "";
        startDateField.value = "";
        endDateField.valueAsDate = new Date();
    }

    var Validation = formValidation();

    if (Validation) {
        // var js = document.createElement("script");
        // js.type = "text/javascript";
        // js.src = "/js/firebaseFetchData.js";
        // document.body.appendChild(js);
        firebaseFetchData();
        showAlert("search_note_alert", "alert-success", null, "Showing Results (Click on close button to clear Results)", null, userDetails);
        hideElement("search_note_form");

    }

    // setTimeout(function () { filterData() }, 2000);
    // filterData();
    clearFields();
}

//Function to push data to firebase
function upload_note() {

    var nameField = document.getElementById('add_name');
    var languageField = document.getElementById('add_language');
    var tagField = document.getElementById('add_tags');
    var noteField = document.getElementById('add_note');
    // noteField.innerHTML = tinyMCE.activeEditor.getContent({format : 'raw'});
    var fileField = document.getElementById('add_file');
    var dateField = document.getElementById('add_date');

    name = nameField.value;
    language = languageField.value;
    tag = tagField.value;
    note = noteField.value;
    date = dateField.value;

    console.log("assigned values");

    var userDetails = "Name : " + name + "<br />Language : " + language +
        "<br />Tag : " + tag + "<br />Note : " + note + "<br />Date : " + date;

    function formValidation() {

        console.log("formValidation is initiated");

        if (!(nameField.value)) {
            showAlert("add_note_alert", "alert-danger", null, "Form Validation Failed", null, "Name can not be null");
            return false;
        }
        // console.log("name : " + nameField.value);
        if (!(languageField.value)) {
            showAlert("add_note_alert", "alert-danger", null, "Form Validation Failed", null, "Language can not be null");
            return false;
        }
        // console.log("languageField : " + languageField.value);
        if (!(tagField.value)) {
            showAlert("add_note_alert", "alert-danger", null, "Form Validation Failed", null, "Tag can not be null");
            return false;
        }
        // console.log("tagField : " + tagField.value);
        if (!(noteField.value)) {
            showAlert("add_note_alert", "alert-danger", null, "Form Validation Failed", null, "Note can not be null");
            return false;
        }
        // console.log("noteField : " + fileField.value);
        if (!(dateField.value)) {
            showAlert("add_note_alert", "alert-danger", null, "Form Validation Failed", null, "Date can not be null");
            return false;
        }
        // console.log("dateField : " + dateField.value);
        return userDetails;

    }

    function clearFields() {
        console.log("clearFields is initiated");
        nameField.value = "";
        languageField.value = "";
        tagField.value = "";
        noteField.value = "";
        fileField.value = "";
        dateField.valueAsDate = new Date();
    }

    var Validation = formValidation();


    console.log("userDeatils created")

    if (Validation) {
        // var js = document.createElement("script");
        // js.type = "text/javascript";
        // js.src = "/js/firebaseSaveData.js";
        // document.body.appendChild(js);
        firebaseSaveData();
        showAlert("add_note_alert", "alert-success", null, "Note Added!", null, userDetails);
    }

    clearFields();

}

function showAlert(parent, alertClassName, headingClassName = "alert-heading", alertHeading, textClassName = "mb-0", alertText) {

    alertClassName += " alert  alert-dismissible fade show";

    //Remove old childs
    removeChilds(parent);

    var alertContainer = document.getElementById(parent);

    var alertDiv = document.createElement("div");
    alertContainer.appendChild(alertDiv);

    alertDiv.setAttribute("class", alertClassName);
    alertDiv.setAttribute("role", "alert");

    var headingElement = document.createElement("h4");
    headingElement.setAttribute("class", headingClassName);
    headingElement.innerHTML = alertHeading;
    alertDiv.appendChild(headingElement);

    var alertCloseButton = document.createElement("button");
    alertCloseButton.setAttribute("type", "button");
    alertCloseButton.setAttribute("class", "close");
    alertCloseButton.setAttribute("data-dissmiss", "alert");
    alertCloseButton.setAttribute("aria-label", "Close");
    alertCloseButton.innerHTML = '<span aria-hidden="true">&times;</span>';
    alertDiv.appendChild(alertCloseButton);

    $(".alert").click(function () {
        showElement("search_note_form");
        $(".alert").alert('close')
        // clearChilds("notes_diplay");
        var container = document.getElementById("notes_diplay");
        //remove previous notes
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    });

    var horizontalBreak = document.createElement("hr");
    alertDiv.appendChild(horizontalBreak);

    var alertTextElement = document.createElement("p");
    alertTextElement.setAttribute("class", textClassName);
    console.log("AlertText : ", alertText);
    //javascript to html
    alertText = alertText.split("\t").join("&nbsp;&nbsp;&nbsp;&nbsp;");
    // alertText = alertText.split(" ").join("&nbsp;");
    alertText = alertText.split("\n").join("<br />");
    alertTextElement.innerHTML = alertText;
    console.log("AlertText : ", alertText);
    alertDiv.appendChild(alertTextElement);

}


var openFile = function (event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        var text = reader.result;
        var texteara = document.getElementById("add_note");
        note = text;
        texteara.value = text;
        console.log(reader.result.substring(0, 200));
    };
    reader.readAsText(input.files[0]);
}


function filterData() {
    var filteredData = [];
    var preciselyFilteredData = [];
    var startDateObejct = new Date(startDate);
    var endDateObject = new Date(endDate);
    var currentDateObject;
    for (i = 0; i < noteData.length; i++) {
        currentDateObject = new Date(noteData[i].date);
        if (endDate && startDate) {
            if (currentDateObject.getTime() >= startDateObejct.getTime() && currentDateObject.getTime() <= endDateObject.getTime()) {
                if (name && noteData[i].name.toUpperCase() === name.toUpperCase()) {
                    preciselyFilteredData.push(noteData[i]);
                } else if (keyword && noteData[i].note.toUpperCase().includes(keyword.toUpperCase())) {
                    preciselyFilteredData.push(noteData[i])
                } else if (language && noteData[i].language.toUpperCase() === language.toUpperCase()) {
                    preciselyFilteredData.push(noteData[i])
                } else if (tag && noteData[i].tag.toUpperCase() === tag.toUpperCase()) {
                    preciselyFilteredData.push(noteData[i])
                }

                else if (name && noteData[i].name.toUpperCase().includes(name.toUpperCase())) {
                    filteredData.push(noteData[i]);
                } else if (keyword && noteData[i].note.toUpperCase().includes(keyword.toUpperCase())) {
                    filteredData.push(noteData[i])
                } else if (language && noteData[i].language.toUpperCase().includes(language.toUpperCase())) {
                    filteredData.push(noteData[i])
                } else if (tag && noteData[i].tag.toUpperCase().includes(tag.toUpperCase())) {
                    filteredData.push(noteData[i])
                } else {
                    if (!(name || keyword || language || tag)) {
                        filteredData.push(noteData[i])
                    }
                }
            }
        } else if (startDate) {
            if (currentDateObject.getTime() >= startDateObejct.getTime()) {
                if (name && noteData[i].name.toUpperCase() == name.toUpperCase()) {
                    preciselyFilteredData.push(noteData[i]);
                } else if (keyword && noteData[i].note.toUpperCase().includes(keyword.toUpperCase())) {
                    preciselyFilteredData.push(noteData[i])
                } else if (language && noteData[i].language.toUpperCase() == language.toUpperCase()) {
                    preciselyFilteredData.push(noteData[i])
                } else if (tag && noteData[i].tag.toUpperCase() == tag.toUpperCase()) {
                    preciselyFilteredData.push(noteData[i])
                }

                else if (name && noteData[i].name.toUpperCase().includes(name.toUpperCase())) {
                    filteredData.push(noteData[i]);
                } else if (keyword && noteData[i].note.toUpperCase().includes(keyword.toUpperCase())) {
                    filteredData.push(noteData[i])
                } else if (language && noteData[i].language.toUpperCase().includes(language.toUpperCase())) {
                    filteredData.push(noteData[i])
                } else if (tag && noteData[i].tag.toUpperCase().includes(tag.toUpperCase())) {
                    filteredData.push(noteData[i])
                } else {
                    if (!(name || keyword || language || tag)) {
                        filteredData.push(noteData[i])
                    }
                }
            }
        } else if (endDate) {
            if (currentDateObject.getTime() <= endDateObject.getTime()) {
                if (name && noteData[i].name.toUpperCase() == name.toUpperCase()) {
                    preciselyFilteredData.push(noteData[i]);
                } else if (keyword && noteData[i].note.toUpperCase().includes(keyword.toUpperCase())) {
                    preciselyFilteredData.push(noteData[i])
                } else if (language && noteData[i].language.toUpperCase() == language.toUpperCase()) {
                    preciselyFilteredData.push(noteData[i])
                } else if (tag && noteData[i].tag.toUpperCase() == tag.toUpperCase()) {
                    preciselyFilteredData.push(noteData[i])
                }

                else if (name && noteData[i].name.toUpperCase().includes(name.toUpperCase())) {
                    filteredData.push(noteData[i]);
                } else if (keyword && noteData[i].note.toUpperCase().includes(keyword.toUpperCase())) {
                    filteredData.push(noteData[i])
                } else if (language && noteData[i].language.toUpperCase().includes(language.toUpperCase())) {
                    filteredData.push(noteData[i])
                } else if (tag && noteData[i].tag.toUpperCase().includes(tag.toUpperCase())) {
                    filteredData.push(noteData[i])
                } else {
                    if (!(name || keyword || language || tag)) {
                        filteredData.push(noteData[i])
                    }
                }
            }
        } else {
            if (name && noteData[i].name.toUpperCase() == name.toUpperCase()) {
                preciselyFilteredData.push(noteData[i]);
            } else if (keyword && noteData[i].note.toUpperCase().includes(keyword.toUpperCase())) {
                preciselyFilteredData.push(noteData[i])
            } else if (language && noteData[i].language.toUpperCase() == language.toUpperCase()) {
                preciselyFilteredData.push(noteData[i])
            } else if (tag && noteData[i].tag.toUpperCase() == tag.toUpperCase()) {
                preciselyFilteredData.push(noteData[i])
            }

            else if (name && noteData[i].name.toUpperCase().includes(name.toUpperCase())) {
                filteredData.push(noteData[i]);
            } else if (keyword && noteData[i].note.toUpperCase().includes(keyword.toUpperCase())) {
                filteredData.push(noteData[i])
            } else if (language && noteData[i].language.toUpperCase().includes(language.toUpperCase())) {
                filteredData.push(noteData[i])
            } else if (tag && noteData[i].tag.toUpperCase().includes(tag.toUpperCase())) {
                filteredData.push(noteData[i])
            } else {
                if (!(name || keyword || language || tag)) {
                    filteredData.push(noteData[i])
                }
            }

        }
    }
    var notes = preciselyFilteredData.concat(filteredData);
    show_notes(notes);
}

function show_notes(notes) {
    removeChilds("notes_diplay");
    for (var i = 0; i < notes.length; i++)
        addToNoteDisplay(notes[i], i);
}

function addToNoteDisplay(note, count) {
    var container = document.getElementById("notes_diplay");
    var card = document.createElement("div");
    card.setAttribute("class", "card")
    container.appendChild(card);

    //Add head
    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class", "card-header");
    innerDiv.setAttribute("id", "heading" + count);
    card.appendChild(innerDiv);

    var h2Ele = document.createElement("h2");
    h2Ele.setAttribute("class", "mb-0 panel-title");
    innerDiv.appendChild(h2Ele)

    var buttonArrow = document.createElement("button");
    if (count == 0)
        buttonArrow.setAttribute("class", "btn btn-link");
    else
        buttonArrow.setAttribute("class", "btn btn-link collapsed");
    buttonArrow.setAttribute("type", "button");
    buttonArrow.setAttribute("data-toggle", "collapse");
    buttonArrow.setAttribute("data-target", "#collapse" + count);
    buttonArrow.setAttribute("aria-expanded", "true");
    buttonArrow.setAttribute("aria-controls", "collapse" + count);
    buttonArrow.innerHTML = '</h3><i class="fas fa-arrow-circle-down arrow-toggle"></i>';
    h2Ele.appendChild(buttonArrow);


    var button = document.createElement("button");
    if (count === 0)
        button.setAttribute("class", "btn btn-link");
    else
        button.setAttribute("class", "btn btn-link collapsed");
    button.setAttribute("type", "button");
    button.setAttribute("data-toggle", "collapse");
    button.setAttribute("data-target", "#collapse" + count);
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", "collapse" + count);
    button.innerHTML = '<h3>' + note.name + '</h3>';
    h2Ele.appendChild(button);

    //Add body
    innerDiv = document.createElement("div");
    innerDiv.setAttribute("id", "collapse" + count);
    if (count === 0)
        innerDiv.setAttribute("class", "collapse show");
    else
        innerDiv.setAttribute("class", "collapse");
    innerDiv.setAttribute("aria-labelledby", "heading" + count);
    innerDiv.setAttribute("data-parent", "#notes_diplay");
    card.appendChild(innerDiv);

    var innerDiv2 = document.createElement("div");
    innerDiv2.setAttribute("class", "card-body");

    note.note = note.note.split("\t").join("&nbsp;&nbsp;&nbsp;&nbsp;");
    note.note = note.note.split(" ").join("&nbsp;");
    note.note = note.note.split("\n").join("<br />");

    innerDiv2.innerHTML = "<h6>Name : " + note.name + "</h6>" + "<br />Language : " + note.language + "<br />Tags :" + note.tag + "<br />Date :" + note.date + "<br />Note : " + note.note;
    innerDiv.appendChild(innerDiv2);

}

function showElement(id) {
    document.getElementById(id).setAttribute("style", "display: block")
}

function hideElement(id) {
    document.getElementById(id).setAttribute("style", "display: none")
}

function removeChilds(id) {
    var container = document.getElementById(id);
    //remove previous notes
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function firebaseFetchData() {
    console.log("firebaseFetchData.js called");
    var count = 0;
    noteKey = [];
    noteData = [];
    // Fetch data from firebase
    (function () {
        console.log("fetching from firebase")
        // noteRef.push({ name: name, language: language, tag: tag, note:note, date: date});
        // var notes = noteRef.orderByChild('date');
        noteRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                noteKey.push(childKey);
                var childData = childSnapshot.val();
                noteData.push(childData)
                console.log("childKey : ", childKey);
                console.log("child Data : ", childData);
            });
            console.log("fetched all data");
            filterData();
        });
        // console.log(noteData);
    }());
}

function firebaseSaveData() {
    console.log("firebaseSaveData.js called");
    
    // Save data to firebase
    (function () {
        console.log("pushing to firebase")
        noteRef.push({ name: name, language: language, tag: tag, note: note, date: date });
        console.log("pushed to firebase");
    }());
}
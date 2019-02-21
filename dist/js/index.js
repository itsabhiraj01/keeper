console.log("index.js called");
var name, category, type, tag, note, date;
var keyword, startDate, endDate;
var noteData, noteKey;
var userDeatils;
// var firebase;
var noteRef, linkRef, tipRef, todoRef, allRef;

window.onload = function () {
    document.getElementById("search_note_submit_button").onclick = fetch_notes;
    document.getElementById("add_note_submit_button").onclick = upload_note;
    document.getElementById("find_note_submit_button").onclick = find_note;
    document.getElementById('forgot_key').onclick = forgot_key;
    document.getElementById("edit_note_submit_button").onclick = edit_note;
    document.getElementById("delete_note_submit_button").onclick = show_auth_dialog;
    document.getElementById('submit_password').onclick = authenticate;
    document.getElementById("add_date").valueAsDate = new Date();
    document.getElementById("search_end_date").valueAsDate = new Date();


    // firebase = firebase.database();    
    noteRef = firebase.database().ref('notes');
    linkRef = firebase.database().ref('links');
    tipRef = firebase.database().ref('tips');
    todoRef = firebase.database().ref('todos');
    allRef = firebase.database().ref('keeper-2923e');

    // tinymce.init({
    //     selector: '#add_note',
    //     // plugins: 'a11ychecker advcode formatpainter linkchecker media mediaembed pageembed permanentpen powerpaste tinycomments tinydrive tinymcespellchecker',
    //     // toolbar: 'a11ycheck code formatpainter insertfile pageembed permanentpen tinycomments',
    //     // tinycomments_mode: 'embedded',
    //     // tinycomments_author: 'Abhiraj'
    //  });

}

function forgot_key(event) {
    $('a[href="#pills-search"]').tab('show');
}


function find_note() {
    var noteFound;
    var path = '';
    if (document.getElementById('find_note_key').value) {
        if (document.getElementById('edit_type_selector').options.selectedIndex == 0) {
            path = 'notes/';
        } else if (document.getElementById('edit_type_selector').options.selectedIndex == 1) {
            path = 'links/';
        } else if (document.getElementById('edit_type_selector').options.selectedIndex == 2) {
            path = 'tips/';
        } else if (document.getElementById('edit_type_selector').options.selectedIndex == 3) {
            path = 'todos/';
        } else {
            path = 'notes/'
        }
        var ref = firebase.database().ref(path);
        ref.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                if (childSnapshot.key === document.getElementById('find_note_key').value) {
                    console.log(childSnapshot.val());
                    noteFound = childSnapshot.val();
                }
            });
            console.log("note : ", noteFound);
            if (noteFound) {
                hideElement('forgot_key');
                hideElement("find_note_form");
                setValuesInEditForm(noteFound);
                showElement("edit_note_form");
            } else {
                showAlert("find_note_alert", "alert-danger", null, "Note not found!", null, "Either the selected type is wrong or key is Invalid.");
            }
        });
    } else {
        showAlert("find_note_alert", "alert-danger", null, "Empty key!", null, "Key cannot be null.");
    }

}

function setValuesInEditForm(note) {
    document.getElementById('edit_name').value = note.name;
    document.getElementById('edit_category').value = note.category;
    document.getElementById('edit_type_selector').options;
    document.getElementById('edit_tags').value = note.tag;
    document.getElementById('edit_note').value = note.note;
}

function edit_note() {
    showElement("find_note_form");
    showElement("forgot_key");
    hideElement("edit_note_form");
    var key = document.getElementById('find_note_key').value;
    update_note(key);

}

// Authentication function
function authenticate() {
    console.log("in function authenticate");
    var password = $('#password').val();
    //using jquery
    var Url = 'https://us-central1-keeper-2923e.cloudfunctions.net/verifyPassword?password=' + password;
    $.ajax({
        url: Url,
        type: "GET",
        success: function (result) {
            if (result) {
                $('#close_modal').click();
                delete_note();
            }
            else {
                $('#password').val('');
                showElement('incorrect_password_label');
            }

        },
        error: function (error) {
            console.log("Error : ", error);
            $('#close_modal').click();
            showAlert("edit_note_alert", "alert-danger", null, "Note updation Failed!", null, "Firebase error!");
        }
    })

}

//On click listener  of Delete button
function show_auth_dialog(key) {
    hideElement('incorrect_password_label');
    $('#modal').modal('toggle');
}

function delete_note() {
    var key = document.getElementById('find_note_key').value;

    showElement("find_note_form");
    showElement("forgot_key");
    hideElement("edit_note_form");

    name = document.getElementById('edit_name').value;
    category = document.getElementById('edit_category').value;
    tag = document.getElementById('edit_tags').value;
    note = document.getElementById('edit_note').value;

    function clearFields() {
        console.log("clearFields is initiated");
        document.getElementById('find_note_key').value = "";
        document.getElementById('edit_type_selector').options.selectedIndex = 0;
    }

    console.log("assigned values");

    userDetails = "Name : " + name + "<br />category : " + category +
        "<br />Tag : " + tag + "<br />Note : " + note;
    
    var success = firebaseRemoveData(key);
    if(success) {
        clearFields();
        showAlert("edit_note_alert", "alert-success", null, "Note Removed!", null, userDetails);
    } else {
        showAlert("edit_note_alert", "alert-danger", null, "Note updation Failed!", null, "Firebase error!");
    }
}

//Functon to fetch data from firebase
function fetch_notes() {
    var nameField = document.getElementById('search_name');
    var categoryField = document.getElementById('search_category');
    var tagField = document.getElementById('search_tags');
    var keywordField = document.getElementById('search_keywords');
    var startDateField = document.getElementById('search_start_date');
    var endDateField = document.getElementById('search_end_date');
    var typeField = document.getElementById('search_type_selector');

    name = nameField.value;
    category = categoryField.value;
    tag = tagField.value;
    keyword = keywordField.value;
    startDate = startDateField.value;
    endDate = endDateField.value;
    type = typeField.options[typeField.selectedIndex].value;
    console.log(typeField.options[typeField.selectedIndex].value);

    userDetails = ""
    if (name) userDetails += "Name : " + name + "<br />";
    if (category) userDetails += "category : " + category + "<br />";
    if (type) userDetails += "Type : " + type + "<br />";
    if (tag) userDetails += "Tag : " + tag + "<br />";
    if (keyword) userDetails += "Keyword : " + keyword + "<br />";
    if (startDate) userDetails += "StartDate : " + startDate + "<br />";
    if (endDate) userDetails += "EndDate : " + endDate;

    function formValidation() {

        console.log("formValidation is initiated");

        if (!(nameField.value || categoryField.value || tagField.value || keywordField.value || startDateField.value || endDateField.value || typeField.value)) {
            showAlert("search_note_alert", "alert-danger", null, "Form Validation Failed", null, "There must be atleast a single non empty field");
            return false;
        }
        //console.log("userDetails : " + userDetails);
        return true;
    }

    function clearFields() {
        console.log("clearFields is initiated");
        nameField.value = "";
        categoryField.value = "";
        typeField.selectedIndex = 0;
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
        firebaseFetchData(userDetails);
        showAlert("search_note_alert", "alert-success", null, "Searching...", null, userDetails);
        hideElement("search_note_form");

    }

    // setTimeout(function () { filterData() }, 2000);
    // filterData();
    clearFields();
}

//Function to push data to firebase
function upload_note() {

    var nameField = document.getElementById('add_name');
    var categoryField = document.getElementById('add_category');
    var typeField = document.getElementById('add_type_selector');
    var tagField = document.getElementById('add_tags');
    var noteField = document.getElementById('add_note');
    // noteField.innerHTML = tinyMCE.activeEditor.getContent({format : 'raw'});
    var fileField = document.getElementById('add_file');
    var dateField = document.getElementById('add_date');

    name = nameField.value;
    category = categoryField.value;
    tag = tagField.value;
    note = noteField.value;
    date = dateField.value;
    type = typeField.options[typeField.selectedIndex].value;

    console.log("assigned values");

    userDetails = "Name : " + name + "<br />category : " + category + "<br />Type : " + type +
        "<br />Tag : " + tag + "<br />Note : " + note + "<br />Date : " + date;

    function formValidation() {

        console.log("formValidation is initiated");

        if (!(nameField.value)) {
            showAlert("add_note_alert", "alert-danger", null, "Form Validation Failed", null, "Name can not be null");
            return false;
        }
        // console.log("name : " + nameField.value);
        if (!(categoryField.value)) {
            showAlert("add_note_alert", "alert-danger", null, "Form Validation Failed", null, "category can not be null");
            return false;
        }
        // console.log("categoryField : " + categoryField.value);
        if (!(typeField.value)) {
            showAlert("add_note_alert", "alert-danger", null, "Form Validation Failed", null, "type can not be null");
            return false;
        }
        // console.log("TypeField : " + typeField.value);
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
        categoryField.value = "";
        typeField.selectedIndex = 0;
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

//Function to push data to firebase
function update_note(key) {

    var nameField = document.getElementById('edit_name');
    var categoryField = document.getElementById('edit_category');
    var tagField = document.getElementById('edit_tags');
    var noteField = document.getElementById('edit_note');

    name = nameField.value;
    category = categoryField.value;
    tag = tagField.value;
    note = noteField.value;

    console.log("assigned values");

    userDetails = "Name : " + name + "<br />category : " + category +
        "<br />Tag : " + tag + "<br />Note : " + note;

    function formValidation() {

        console.log("formValidation is initiated");

        if (!(nameField.value)) {
            showAlert("edit_note_alert", "alert-danger", null, "Form Validation Failed", null, "Name can not be null");
            return false;
        }
        // console.log("name : " + nameField.value);
        if (!(categoryField.value)) {
            showAlert("edit_note_alert", "alert-danger", null, "Form Validation Failed", null, "category can not be null");
            return false;
        }
        // console.log("categoryField : " + categoryField.value);
        if (!(tagField.value)) {
            showAlert("edit_note_alert", "alert-danger", null, "Form Validation Failed", null, "Tag can not be null");
            return false;
        }
        // console.log("tagField : " + tagField.value);
        if (!(noteField.value)) {
            showAlert("edit_note_alert", "alert-danger", null, "Form Validation Failed", null, "Note can not be null");
            return false;
        }
        // console.log("noteField : " + fileField.value);
        return userDetails;

    }

    function clearFields() {
        console.log("clearFields is initiated");
        document.getElementById('find_note_key').value = "";
        document.getElementById('edit_type_selector').options.selectedIndex = 0;
    }

    var Validation = formValidation();

    console.log("userDeatils created")

    if (Validation) {
        console.log("validation successfull");
        // var js = document.createElement("script");
        // js.type = "text/javascript";
        // js.src = "/js/firebaseSaveData.js";
        // document.body.appendChild(js);
        var success = firebaseUpdateData(key);
        if (success) {
            showAlert("edit_note_alert", "alert-success", null, "Note Updated!", null, userDetails);
            clearFields();
        }
        else
            showAlert("edit_note_alert", "alert-danger", null, "Note updation Failed!", null, "Firebase error!");
    }

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

    if (parent === "search_note_alert" && alertClassName === "alert-success alert  alert-dismissible fade show") {
        showElement("fetch_notes_spinner");
    }


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
    var filteredKey = [];
    var preciselyFilteredKey = [];
    var startDateObejct = new Date(startDate);
    var endDateObject = new Date(endDate);
    var currentDateObject;

    function addToNotesPriorityList() {
        if (name && noteData[i].name.toUpperCase() === name.toUpperCase()) {
            preciselyFilteredData.push(noteData[i]);
            preciselyFilteredKey.push(noteKey[i]);
        } else if (keyword && noteData[i].note.toUpperCase().includes(keyword.toUpperCase())) {
            preciselyFilteredData.push(noteData[i])
            preciselyFilteredKey.push(noteKey[i])
        } else if (category && noteData[i].category.toUpperCase() === category.toUpperCase()) {
            preciselyFilteredData.push(noteData[i])
            preciselyFilteredKey.push(noteKey[i])
        } else if (tag && noteData[i].tag.toUpperCase() === tag.toUpperCase()) {
            preciselyFilteredData.push(noteData[i])
            preciselyFilteredKey.push(noteKey[i])
        }

        else if (name && noteData[i].name.toUpperCase().includes(name.toUpperCase())) {
            filteredData.push(noteData[i]);
            filteredKey.push(noteKey[i]);
        } else if (keyword && noteData[i].note.toUpperCase().includes(keyword.toUpperCase())) {
            filteredData.push(noteData[i])
            filteredKey.push(noteKey[i])
        } else if (category && noteData[i].category.toUpperCase().includes(category.toUpperCase())) {
            filteredData.push(noteData[i])
            filteredKey.push(noteKey[i])
        } else if (tag && noteData[i].tag.toUpperCase().includes(tag.toUpperCase())) {
            filteredData.push(noteData[i])
            filteredKey.push(noteKey[i])
        } else {
            if (!(name || keyword || category || tag)) {
                filteredData.push(noteData[i])
                filteredKey.push(noteKey[i])
            }
        }
    }

    for (i = 0; i < noteData.length; i++) {
        currentDateObject = new Date(noteData[i].date);
        if (endDate && startDate) {
            if (currentDateObject.getTime() >= startDateObejct.getTime() && currentDateObject.getTime() <= endDateObject.getTime()) {
                addToNotesPriorityList();
            }
        } else if (startDate) {
            if (currentDateObject.getTime() >= startDateObejct.getTime()) {
                addToNotesPriorityList();
            }
        } else if (endDate) {
            if (currentDateObject.getTime() <= endDateObject.getTime()) {
                addToNotesPriorityList();
            }
        } else {
            addToNotesPriorityList();
        }
    }
    var notes = preciselyFilteredData.concat(filteredData);
    var keys = preciselyFilteredKey.concat(filteredKey);
    showAlert("search_note_alert", "alert-success", null, "Showing " + notes.length + " Results (double tap to close)", null, userDetails);
    show_notes(notes, keys);
}


function show_notes(notes, keys) {
    removeChilds("notes_diplay");
    for (var i = 0; i < notes.length; i++)
        addToNoteDisplay(notes[i], keys[i], i);
}

function addToNoteDisplay(note, key, count) {
    var container = document.getElementById("notes_diplay");
    var card = document.createElement("div");
    card.setAttribute("class", "card");
    container.appendChild(card);

    //Add head
    var outerDiv = document.createElement("div");
    outerDiv.setAttribute("class", "col-xs-12-nw")
    card.appendChild(outerDiv);

    var innerDiv = document.createElement("div");
    innerDiv.setAttribute("class", "card-header col-xs-10-nw pointer");
    innerDiv.setAttribute("id", "heading" + count);
    innerDiv.setAttribute("data-toggle", "collapse");
    innerDiv.setAttribute("data-target", "#collapse" + count);
    innerDiv.setAttribute("aria-expanded", "true");
    innerDiv.setAttribute("aria-controls", "collapse" + count);
    outerDiv.appendChild(innerDiv);

    var h2Ele = document.createElement("h3");
    h2Ele.setAttribute("class", "mb-0 panel-title text-primary");
    h2Ele.innerHTML = note.name;
    innerDiv.appendChild(h2Ele)

    var editDiv = document.createElement("div");
    editDiv.setAttribute("id", "edit");
    editDiv.setAttribute("class", "card-header col-xs-2-nw pointer");
    editDiv.setAttribute("onClick", 'editClickListener("' + key + '");')
    // editDiv.innerHTML = '<a href="#pills-edit" style="display:none;"></a>';


    outerDiv.appendChild(editDiv);

    var h2Ele2 = document.createElement("h3");
    h2Ele2.setAttribute("class", "mb-0 panel-title text-primary");
    h2Ele2.innerHTML = '<i class="fas fa-edit"></i>';
    editDiv.appendChild(h2Ele2);

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

    note.note = note.note.split("\t").join("&nbsp;&nbsp;&nbsp;&nbsp;");
    note.note = note.note.split(" ").join("&nbsp;");
    note.note = note.note.split("\n").join("<br />");

    var innerDiv2 = document.createElement("div");
    innerDiv2.setAttribute("class", "card-body");
    console.log("type", type);
    if (type == "link")
        innerDiv2.innerHTML = "<h6>Name : " + note.name + "</h6>" + "<br />category : " + note.category + "<br />Tags :" + note.tag + "<br />Date :" + note.date + "<br />Link : " + '<a href="' + note.note + '">' + note.note + '</a>';
    else
        innerDiv2.innerHTML = "<h6>Name : " + note.name + "</h6>" + "<br />category : " + note.category + "<br />Tags :" + note.tag + "<br />Date :" + note.date + "<br />Note : " + note.note;
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

function firebaseFetchData(userDetails) {
    var ref;
    switch (type) {
        case "note":
            ref = noteRef;
            break;
        case "link":
            ref = linkRef;
            break;
        case "tip":
            ref = tipRef;
            break;
        case "todo":
            ref = todoRef;
            break;
        default:
            alert("Type must be defined")
            ref = noteRef;
    }
    console.log("firebaseFetchData.js called");

    noteKey = [];
    noteData = [];
    // Fetch data from firebase
    (function () {
        console.log("fetching from firebase")
        ref.once('value', function (snapshot) {
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
            hideElement("fetch_notes_spinner");
        });
        // console.log(noteData);
    }());
}

function firebaseSaveData() {
    console.log("firebaseSaveData.js called");

    // Save data to firebase
    (function () {
        console.log("pushing to firebase")
        switch (type) {
            case "note":
                noteRef.push({ name: name, category: category, tag: tag, note: note, date: date });
                break;
            case "link":
                linkRef.push({ name: name, category: category, tag: tag, note: note, date: date });
                break;
            case "tip":
                tipRef.push({ name: name, category: category, tag: tag, note: note, date: date });
                break;
            case "todo":
                todoRef.push({ name: name, category: category, tag: tag, note: note, date: date });
                break;
            default:
                alert("No type found");
        }
        console.log("pushed to firebase");
    }());
}

function firebaseUpdateData(key) {
    console.log("firebaseUpdateData.js called");
    var success = false;
    // Save data to firebase
    (function () {
        console.log("pushing to firebase");
        console.log("type : ", type, ", name : ", name, ", category : ", category, ", tags : ", tag, ", note : ", note, ", and key : ", key);
        switch (type) {
            case "note":
                noteRef.child(key).update({ name: name, category: category, tag: tag, note: note });
                success = true;
                break;
            case "link":
                linkRef.child(key).update({ name: name, category: category, tag: tag, note: note });
                success = true;
                break;
            case "tip":
                tipRef.child(key).update({ name: name, category: category, tag: tag, note: note });
                success = true;
                break;
            case "todo":
                todoRef.child(key).update({ name: name, category: category, tag: tag, note: note });
                success = true;
                break;
            default:
                success = false;
                alert("No type found");
        }
        console.log("pushed to firebase");
    }());
    return success;
}

function firebaseRemoveData(key) {
    console.log("firebaseRemoveData.js called");
    var success = false;
    // Save data to firebase
    (function () {
        console.log("removing from firebase");
        console.log("type : ", type, ", name : ", name, ", category : ", category, ", tags : ", tag, ", note : ", note, ", and key : ", key);
        switch (type) {
            case "note":
                ref = firebase.database().ref('notes/' + key);
                ref.remove();
                success = true;
                break;
            case "link":
                ref = firebase.database().ref('links/' + key);
                ref.remove();
                success = true;
                break;
            case "tip":
                ref = firebase.database().ref('tips/' + key);
                ref.remove(); success = true;
                break;
            case "todo":
                ref = firebase.database().ref('todos/' + key);
                ref.remove(); success = true;
                break;
            default:
                success = false;
                alert("No type found");
        }
        console.log("pushed to firebase");
    }());
    return success;
}


function editClickListener(key) {
    document.getElementById('find_note_key').value = key;
    if (type == "note") {
        document.getElementById('edit_type_selector').options.selectedIndex = 0;
    } else if (type == "link") {
        document.getElementById('edit_type_selector').options.selectedIndex = 1;
    } else if (type == "tip") {
        document.getElementById('edit_type_selector').options.selectedIndex = 2;
    } else if (type == "todo") {
        document.getElementById('edit_type_selector').options.selectedIndex = 3
    } else {
        alert("Can't find type");
    }
    $('a[href="#pills-edit"]').tab('show');
}

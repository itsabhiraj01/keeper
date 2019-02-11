$(function () {

    var noteRef = firebase.database().ref('notes');

    var noteData = [];

    //Add Enter action on search box
    enableEnter("search_global", "search_global_submit_button");

    // Fetch data from firebase
    $('#search_global_submit_button').click(function () {
        hideElement("home_carousel");
        showElement("global_notes_spinner");
        searchNote($('#search_global').val());
    });

    function searchNote(search) {
        noteData = [];
        noteRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                noteData.push(childData);
            });
            var notes = [];
            for (i = 0; i < noteData.length; i++) {
                if (noteData[i].name.toUpperCase() === search.toUpperCase()) {
                    notes.push(noteData[i]);
                    noteData = jQuery.grep(noteData, function (value) {
                        return value != noteData[i];
                    });
                } else if (noteData[i].name.toUpperCase().includes(search.toUpperCase())) {
                    notes.push(noteData[i]);
                    noteData = jQuery.grep(noteData, function (value) {
                        return value != noteData[i];
                    });
                }
            }
            for (i = 0; i < noteData.length; i++) {
                if (noteData[i].category.toUpperCase() === search.toUpperCase()) {
                    notes.push(noteData[i]);
                    noteData = jQuery.grep(noteData, function (value) {
                        return value != noteData[i];
                    });
                } else if (noteData[i].category.toUpperCase().includes(search.toUpperCase())) {
                    notes.push(noteData[i]);
                    noteData = jQuery.grep(noteData, function (value) {
                        return value != noteData[i];
                    });
                }
            }
            for (i = 0; i < noteData.length; i++) {
                if (noteData[i].tag.toUpperCase() === search.toUpperCase()) {
                    notes.push(noteData[i]);
                    noteData = jQuery.grep(noteData, function (value) {
                        return value != noteData[i];
                    });
                } else if (noteData[i].tag.toUpperCase().includes(search.toUpperCase())) {
                    notes.push(noteData[i]);
                    noteData = jQuery.grep(noteData, function (value) {
                        return value != noteData[i];
                    });
                }
            }
            for (i = 0; i < noteData.length; i++) {
                if (noteData[i].note.toUpperCase().includes(search.toUpperCase())) {
                    notes.push(noteData[i]);
                    noteData = jQuery.grep(noteData, function (value) {
                        return value != noteData[i];
                    });
                } else if (noteData[i].note.toUpperCase().includes(search.toUpperCase())) {
                    notes.push(noteData[i]);
                    noteData = jQuery.grep(noteData, function (value) {
                        return value != noteData[i];
                    });
                }
            }
            var container = $('#global_notes_display');
            container.empty();
            for (i = 0; i < notes.length; i++) {
                var card = $("<div></div>");
                card.attr("class", "card")
                container.append(card);

                //Outer Div in head
                var outerDiv = $("<div></div>");
                outerDiv.attr("class", "col-xs-12-nw")
                card.append(outerDiv);

                //Add head
                var innerDiv = $("<div></div>");
                innerDiv.attr("class", "card-header pointer");
                innerDiv.attr("id", "heading" + i);
                innerDiv.attr("data-toggle", "collapse");
                innerDiv.attr("data-target", "#collapse" + i);
                innerDiv.attr("aria-expanded", "true");
                innerDiv.attr("aria-controls", "collapse" + i);
                outerDiv.append(innerDiv);

                var h2Ele = $("<h2></h2>");
                h2Ele.attr("class", "mb-0 panel-title text-primary");

                var ul = $("<ul></ul>");
                innerDiv.append(h2Ele);
                var li = $("<li></li>");
                ul.append(li);

                var button = $("<p></p>");
                button.attr("class", "text-primary");
                button.html('<h3>' + notes[i].name + '</h3>');
                h2Ele.append(button);

                //Add body
                innerDiv = $("<div></div>");
                innerDiv.attr("id", "collapse" + i);
                if (i === 0)
                    innerDiv.attr("class", "collapse show");
                else
                    innerDiv.attr("class", "collapse");
                innerDiv.attr("aria-labelledby", "heading" + i);
                innerDiv.attr("data-parent", "#global_notes_display");
                card.append(innerDiv);

                var innerDiv2 = $("<div></div>");
                innerDiv2.attr("class", "card-body");

                innerDiv2.html("<pre><b>Name     : " + notes[i].name     + "</b></pre>" +
                               "<pre><b>category : " + notes[i].category + "</b></pre>" +
                               "<pre><b>Date     : " + notes[i].date     + "</b></pre>" +
                               "<hr><pre>"           + notes[i].note     + "</pre>");
                innerDiv.append(innerDiv2);
                hideElement("global_notes_spinner");

            }
        });
    }

});
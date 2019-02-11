console.log("index.js called");

window.onload = function () {
    document.getElementById("add_note_submit_button").onclick = get_action;
}

function get_action() {
    var js = document.createElement("script");

    js.type = "text/javascript";
    js.src = "/js/firebaseSaveData.js";
    showAlert();
    document.body.appendChild(js);
}

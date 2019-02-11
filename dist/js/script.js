(function () {

    var scriptArray = [
        "/js/firebaseSaveData.js"
    ];

    for(var i = 0; i < scriptArray.length; i++) {
        var js = document.createElement("script"+i);
        js.type = "text/javascript";
        js.src = scriptArray[i];
        showAlert();
        document.body.appendChild(js);
    }
}());
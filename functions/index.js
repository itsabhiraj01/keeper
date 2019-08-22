'use strict';

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// For Pdf parsing
var _ = require('underscore'),
    PDFParser = require('pdf2json');

//Firebase Private Key
var serviceAccount = require("/home/abhiraj/abhi/keeper-2923e-firebase-adminsdk-143ck-26dd73c27d.json");

// variable to store all pdf scrapping results
var scrappedPdf = [];
var tempRecord;

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://keeper-2923e.firebaseio.com"
});

const cors = require('cors')({
    origin: true
});

exports.verifyPassword = functions.https.onRequest((request, response) => {
    console.log("outer req : ", request);
    return cors(request, response, () => {
        // Grab the text parameter.
        console.log("inner request : ", request);
        const password = request.query.password;
        // Push the new message into the Realtime Database using the Firebase Admin SDK.
        return admin.database().ref("password").once('value').then((snapshot) => {
            // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
            var childData = snapshot.val();
            console.log("password : ", childData, "   and user entered : ", password);
            if (childData === password) {
                return response.status(200).send(true);
            } else {
                return response.status(200).send(false);
            }
        });
    });
});

exports.removeData = functions.https.onRequest((request, response) => {
    return cors(request, response, async _ => {
        console.log("1 Running removeData");
        // Grab the text parameter.
        const node = request.body.data.node;
        const key = request.body.data.key;
        console.log("key :", key, "and node :", node);
        // Push the new message into the Realtime Database using the Firebase Admin SDK.
        if (node && key) {
            await admin.database().ref(node + "/" + key).remove();
            console.log("2 returning result :");
            return response.status(200).send({ 'data': { 'result': true } });
        } else {
            console.log("2 null node or key ");
            return response.status(200).send({ 'data': { 'result': false } });
        }
    });
});

exports.scrapPdf = functions.https.onRequest((request, response) => {
    return cors(request, response, async _ => {
        console.log("Scrapping all docs");
        // Grab the text parameter.
        try {
            var keyword = request.body.data.keyword;
            console.log("keyword :", keyword);
            if (keyword) {
                await admin.database().ref("files").once('value', snapshot => {
                    snapshot.forEach((childSnapshot) => {
                        var childKey = childSnapshot.key;
                        console.log("Data Key : ", childKey);
                        var childData = childSnapshot.val();
                        console.log("child Data : ", childData);
                        var result = {}; tempRecord = [];
                        getJsonFromPdf(childData.url);
                        result["file"] = childData.name;
                        result["occurances"] = tempRecord;
                        scrappedPdf.push(result);
                    });
                    console.log("fetched all data");
                });
                return response.status(200).send({ 'data': { 'result': true, "resultArray": scrappedPdf } });
            } else {
                return response.status(200).send({ 'data': { 'result': false } });
            }
        } catch (err) {
            console.log("Error : ", err);
            return response.status(400).send({ 'data': { 'result': false } });
        }
    });
});


//PDF parsing


var pdfParser = new PDFParser();

var _onPDFBinDataReady = function (pdf) {
    if (pdf.formImage === undefined) return;
    var allPages = [];
    for (var i in pdf.formImage.Pages) {
        var page = pdf.formImage.Pages[i];
        var pageRec = {};
        for (var j in page.Texts) {
            var text = page.Texts[j];
            //console.log(text.R[0].T);
            if (text.R[0].T === "ghc") {
                var occ = {};
                // console.log("Found in page : ", i);
                var pageText = "";
                for (var k in page.Texts) {
                    pageText = pageText + " " + page.Texts[k].R[0].T;
                }
                occ.page = j;
                occ.text = decodeURIComponent(pageText);
                pageRec.occurence = occ;
                break;
            }
        }
        allPages.push(pageRec);
    }
    tempRec = allPages;
};

// Create an error handling function
var _onPDFBinDataError = function (error) {
    console.log(error);
};

// Use underscore to bind the data read
pdfParser.on('pdfParser_dataReady', _.bind(_onPDFBinDataReady, this));

// Register error handling function
pdfParser.on('pdfParser_dataError', _.bind(_onPDFBinDataError, this));

// Load the pdf. When it is loaded your data ready function will be called.
function getJsonFromPdf(pdfFilePath) {
    pdfParser.loadPDF(pdfFilePath);
}
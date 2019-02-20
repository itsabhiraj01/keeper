// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// //The Twilio SDk to send otp
// var twilio = require('twilio');
// const accountSid = 'ACdae6c59aae455d8041cb6137cc5952c7';
// const authToken = 'b7a2b083b8297617eebc3f08947afa87';
// const client = require('twilio')(accountSid, authToken);


//Finction helloWorld
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});




















// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return admin.database().ref('/messages').push({ original: original }).then((snapshot) => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        return res.redirect(303, snapshot.ref.toString());
    });
});


// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
        // Grab the current value of what was written to the Realtime Database.
        const original = snapshot.val();
        console.log('Uppercasing', context.params.pushId, original);
        const uppercase = original.toUpperCase();
        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
        return snapshot.ref.parent.child('uppercase').set(uppercase);
    });

exports.addOtp = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const otp = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return admin.database().ref('/otp').push({ otp: otp }).then((snapshot) => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        return res.redirect(303, snapshot.ref.toString());
    });
});

//Error need to have paid plan to make external api requests
exports.sendOtp = functions.database.ref('/otp/{pushId}/otp')
    .onCreate((snapshot, context) => {
        // Grab the current value of what was written to the Realtime Database.
        const otp = snapshot.val();
        console.log('Sending otp', context.params.pushId, otp);
        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        return client.messages
            .create({
                body: 'Your otp for keeper is : ' + otp,
                from: '+17576074703',
                to: '+918889250288'
            })
            .then(message => console.log(message.sid));
    });



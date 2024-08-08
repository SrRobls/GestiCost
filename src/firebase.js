var admin = require("firebase-admin");

var serviceAccount = require("../gesticost-48429-firebase-adminsdk-t36fu-7a36eb0749");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gesticost-48429-default-rtdb.firebaseio.com"
});



exports.admin = admin;
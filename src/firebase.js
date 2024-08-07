var admin = require("firebase-admin");
var serviceAccount = require("../gesticost-48429-firebase-adminsdk-t36fu-90f7d56dd3.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gesticost-48429-default-rtdb.firebaseio.com"
});



exports.admin = admin;
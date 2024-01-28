
// const admin = require("firebase-admin");
// admin.initializeApp({
//     credential: admin.credential.cert(require("./mindchamp-notification-firebase-adminsdk-xap53-e5005e43c2.json")),
// });

// module.exports = admin;

import * as admin from 'firebase-admin';
import {serviceAccountConfig} from './service'; 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountConfig as admin.ServiceAccount),
});

export default admin;

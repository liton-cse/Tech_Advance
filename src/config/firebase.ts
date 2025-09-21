import admin from 'firebase-admin';
import path from 'path';

// Service account file from Firebase Console
const serviceAccount = require(path.join(
  __dirname,
  '../../serviceAccountKey.json'
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

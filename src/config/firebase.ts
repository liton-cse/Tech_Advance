import admin from 'firebase-admin';
import serviceAccount from '../config/serviceAccountKey.json'; // JSON import works with resolveJsonModule

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;

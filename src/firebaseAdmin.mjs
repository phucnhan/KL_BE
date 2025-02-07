import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Lấy chuỗi Base64 từ biến môi trường
const base64Key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!base64Key) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set in environment variables.");
}

// Giải mã chuỗi Base64 thành JSON
const serviceAccount = JSON.parse(
  Buffer.from(base64Key, 'base64').toString('utf-8')
);

// Khởi tạo Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fir-c8ee2.firebaseio.com'
});

const db = admin.firestore();

export default db;

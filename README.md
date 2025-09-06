# Yasmeen-Abbas
# تحديات يومية قصيرة 🎯

تطبيق ويب بسيط:
- تسجيل دخول Google
- اختيار مادة
- استقبال تحدي يومي عشوائي عبر إشعار

## التقنيات
- Firebase (Auth, Firestore, Messaging, Functions)
- GitHub Pages لاستضافة الواجهة

## النشر
1. اربط مشروعك بـ Firebase Console.
2. حدث `firebaseConfig` في `app.js` و `firebase-messaging-sw.js`.
3. ارفع الملفات على GitHub.
4. فعل GitHub Pages من إعدادات الريبو.
5. انشر الـ Cloud Functions عبر:
   ```bash
   cd functions
   npm install
   firebase deploy --only functions

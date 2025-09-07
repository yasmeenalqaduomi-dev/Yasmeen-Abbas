// استيراد مكتبات Firebase (إصدار compat المناسب للـ service worker)
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// تهيئة Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAi5yQBIXC5_s5xZhkW5Ptw4T2iIraj80I",
  authDomain: "daily-challenges-1df2d.firebaseapp.com",
  projectId: "daily-challenges-1df2d",
  storageBucket: "daily-challenges-1df2d.firebasestorage.app",
  messagingSenderId: "939866767729",
  appId: "1:939866767729:web:049e3f30ebfdb60be876d0",
  measurementId: "G-YL7LTRTVL6"
});

// Firebase Messaging
const messaging = firebase.messaging();

// استقبال الإشعارات بالخلفية
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png' // ممكن تضيفي أي أيقونة لمشروعك
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

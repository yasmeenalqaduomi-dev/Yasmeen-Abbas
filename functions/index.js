const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();

// وظيفة كل 15 دقيقة
exports.dailyNotifier = functions.pubsub.schedule("every 15 minutes").onRun(async () => {
  const usersSnap = await db.collection("users").get();
  const promises = [];

  usersSnap.forEach(userDoc => {
    const user = userDoc.data();
    if(!user.fcmToken) return;

    const hour = new Date().getHours();
    const { windowStart=9, windowEnd=21 } = user.preferences || {};

    if(hour >= windowStart && hour <= windowEnd){
      // احتمال بسيط لإرسال تحدي مرة باليوم
      if(Math.random() < 0.01){
        promises.push(messaging.send({
          token: user.fcmToken,
          notification: {
            title: "تحدي جديد 🎯",
            body: "افتح التطبيق لحل السؤال اليومي!"
          }
        }));
      }
    }
  });

  await Promise.all(promises);
  return null;
});

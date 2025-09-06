// Firebase إعدادات (غيريها بالقيم من Firebase console)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const messaging = firebase.messaging();

// تسجيل دخول Google
document.getElementById("btn-login").onclick = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  const result = await auth.signInWithPopup(provider);
  const user = result.user;

  // إنشاء/تحديث المستخدم في Firestore
  await db.collection("users").doc(user.uid).set({
    displayName: user.displayName,
    email: user.email,
    preferences: { subject: "math", windowStart: 9, windowEnd: 21 },
    score: 0
  }, { merge: true });

  document.getElementById("auth-area").style.display = "none";
  document.getElementById("main-area").style.display = "block";
  loadSubjects();
  requestPermission(user.uid);
};

// تحميل المواد من Firestore
async function loadSubjects(){
  const snapshot = await db.collection("subjects").get();
  const sel = document.getElementById("subject-select");
  snapshot.forEach(doc => {
    const opt = document.createElement("option");
    opt.value = doc.id;
    opt.text = doc.data().name;
    sel.appendChild(opt);
  });
}

document.getElementById("btn-save").onclick = async () => {
  const user = auth.currentUser;
  if(!user) return;
  const subjectId = document.getElementById("subject-select").value;
  await db.collection("users").doc(user.uid).update({
    "preferences.subject": subjectId
  });
  document.getElementById("status").innerText = "تم الحفظ ✅";
};

// إذن إشعارات
async function requestPermission(uid){
  try {
    const token = await messaging.getToken();
    if(token){
      await db.collection("users").doc(uid).update({ fcmToken: token });
      console.log("Token saved:", token);
    }
  } catch(err){
    console.warn("إذن الإشعارات مرفوض:", err);
  }
}

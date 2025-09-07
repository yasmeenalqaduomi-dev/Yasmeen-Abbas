// -------------------- 🔹 Firebase Config --------------------
const firebaseConfig = {
  apiKey: "AIzaSyAi5yQBIXC5_s5xZhkW5Ptw4T2iIraj80I",
  authDomain: "daily-challenges-1df2d.firebaseapp.com",
  projectId: "daily-challenges-1df2d",
  storageBucket: "daily-challenges-1df2d.firebasestorage.app",
  messagingSenderId: "939866767729",
  appId: "1:939866767729:web:049e3f30ebfdb60be876d0",
  measurementId: "G-YL7LTRTVL6"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);

// ✅ Services
const auth = firebase.auth();
const db = firebase.firestore();
const messaging = firebase.messaging();

// -------------------- 🔹 تسجيل الدخول باستخدام Google --------------------
document.getElementById("btn-login").onclick = async () => {
  try {
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

    // إظهار/إخفاء الواجهات
    document.getElementById("auth-area").style.display = "none";
    document.getElementById("main-area").style.display = "block";

    // تحميل المواد
    loadSubjects();

    // طلب إذن إشعارات
    requestPermission(user.uid);

    alert("أهلاً " + user.displayName);
  } catch (error) {
    console.error("❌ Error during login:", error.message);
    alert("خطأ في تسجيل الدخول");
  }
};

// -------------------- 🔹 تسجيل الخروج --------------------
document.getElementById("btn-logout").onclick = async () => {
  try {
    await auth.signOut();
    console.log("✅ User signed out.");
    document.getElementById("auth-area").style.display = "block";
    document.getElementById("main-area").style.display = "none";
    document.getElementById("user-info").innerText = "غير مسجل دخول";
    alert("تم تسجيل الخروج");
  } catch (error) {
    console.error("❌ Error during sign out:", error.message);
  }
};

// -------------------- 🔹 متابعة حالة المستخدم --------------------
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("👤 Logged in:", user.email);
    document.getElementById("user-info").innerText = "مرحباً " + user.displayName;
  } else {
    console.log("🚪 No user logged in");
    document.getElementById("user-info").innerText = "غير مسجل دخول";
  }
});

// -------------------- 🔹 تحميل المواد من Firestore --------------------
async function loadSubjects() {
  const snapshot = await db.collection("subjects").get();
  const sel = document.getElementById("subject-select");
  sel.innerHTML = ""; // تفريغ القائمة قبل التعبئة
  snapshot.forEach(doc => {
    const opt = document.createElement("option");
    opt.value = doc.id;
    opt.text = doc.data().name;
    sel.appendChild(opt);
  });
}

// -------------------- 🔹 حفظ تفضيلات المستخدم --------------------
document.getElementById("btn-save").onclick = async () => {
  const user = auth.currentUser;
  if (!user) return;
  const subjectId = document.getElementById("subject-select").value;
  await db.collection("users").doc(user.uid).update({
    "preferences.subject": subjectId
  });
  document.getElementById("status").innerText = "تم الحفظ ✅";
};

// -------------------- 🔹 إذن إشعارات + حفظ Token --------------------
async function requestPermission(uid) {
  try {
    const token = await messaging.getToken();
    if (token) {
      await db.collection("users").doc(uid).update({ fcmToken: token });
      console.log("🔔 Token saved:", token);
    }
  } catch (err) {
    console.warn("🚫 إشعارات مرفوضة:", err);
  }
}

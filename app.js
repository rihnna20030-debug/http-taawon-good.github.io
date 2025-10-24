// 🔥 استيراد مكتبات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot,
  query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

// 🔧 إعدادات مشروعك في Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAq0OT0-KJtJpY1S59SDT7xy2JoM7zc",
  authDomain: "taawon-good.firebaseapp.com",
  projectId: "taawon-good",
  storageBucket: "taawon-good.appspot.com",
  messagingSenderId: "942276973941",
  appId: "1:942276973941:web:380897d6d97382b084b50d",
  measurementId: "G-SL7HBNNE0L"
};

// 🚀 تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🌟 عناصر الصفحة
const btnAnon = document.getElementById("btnAnonSignIn");
const formMsg = document.getElementById("formMsg");
const form = document.getElementById("postForm");
const titleEl = document.getElementById("title");
const cityEl = document.getElementById("city");
const descEl = document.getElementById("description");
const catEl = document.getElementById("category");
const postsDiv = document.getElementById("posts");
const emptyState = document.getElementById("emptyState");

let uid = null;

// 🟢 تسجيل دخول مجهول
btnAnon?.addEventListener("click", async () => {
  try {
    await signInAnonymously(auth);
    formMsg.textContent = "تم تسجيل الدخول ✅";
  } catch (e) {
    formMsg.textContent = "تعذّر تسجيل الدخول ❌";
    console.error(e);
  }
});

// حفظ حالة المستخدم
onAuthStateChanged(auth, (user) => {
  uid = user ? user.uid : null;
});

// ⏰ تنسيق الوقت بالعربية
function fmt(ts) {
  if (!ts?.toDate) return "الآن";
  const d = ts.toDate();
  return d.toLocaleString("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// 🧺 إيموجي حسب نوع المشاركة
function catEmoji(c) {
  if (c === "تبرع") return "🧺";
  if (c === "طلب") return "🙏";
  if (c === "فعالية") return "🎉";
  return "✨";
}

// 📨 إرسال مشاركة جديدة
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!uid) {
    formMsg.textContent = "سجّلي دخول سريع أولاً.";
    return;
  }

  const data = {
    title: titleEl.value.trim(),
    city: cityEl.value.trim(),
    description: descEl.value.trim(),
    category: catEl?.value || "تبرع",
    createdAt: serverTimestamp(),
    createdBy: uid,
  };

  if (!data.title) {
    formMsg.textContent = "العنوان إجباري.";
    return;
  }

  try {
    await addDoc(collection(db, "posts"), data);
    form.reset();
    formMsg.textContent = "✅ تمت الإضافة بنجاح!";
    setTimeout(() => (formMsg.textContent = ""), 2000);
  } catch (err) {
    console.error(err);
    formMsg.textContent = "❌ خطأ أثناء الحفظ";
  }
});

// 👀 عرض المشاركات لحظيًا مع التأثيرات
if (postsDiv) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snap) => {
    postsDiv.innerHTML = "";
    if (snap.empty) {
      emptyState.style.display = "block";
      return;
    }
    emptyState.style.display = "none";

    snap.forEach((doc) => {
      const p = doc.data();
      const badgeClass =
        p.category === "تبرع"
          ? "green"
          : p.category === "طلب"
          ? "yellow"
          : "blue";

      const el = document.createElement("article");
      el.className = "post";
      el.style.animationDelay = ${Math.random() * 0.3}s;

      el.innerHTML = `
        <div class="post-head">
          <span class="badge ${badgeClass}">
            ${catEmoji(p.category)} ${p.category || ""}
          </span>
          <small class="muted">${fmt(p.createdAt)}</small>
        </div>
        <h4>${p.title || ""}</h4>
        <p>${p.description || ""}</p>
        <div class="meta">${p.city ? "📍 " + p.city : ""}</div>
      `;
      postsDiv.appendChild(el);
    });
  });
}

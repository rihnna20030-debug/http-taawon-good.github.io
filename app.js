// استيراد مكتبات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// إعدادات مشروعك من Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAq0OT0-KJtJpY1S59SDT7xy2JoM7zc",
  authDomain: "taawon-good.firebaseapp.com",
  projectId: "taawon-good",
  storageBucket: "taawon-good.appspot.com",
  messagingSenderId: "942276973941",
  appId: "1:942276973941:web:380897d6d97382b084b50d",
  measurementId: "G-SL7HBNNE0L"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// عناصر الصفحة
const btnAnon = document.getElementById("btnAnonSignIn");
const formMsg = document.getElementById("formMsg");
const form = document.getElementById("postForm");
const postsDiv = document.getElementById("posts");
const emptyState = document.getElementById("emptyState");

let userId = null;

// تسجيل الدخول المجهول
btnAnon.addEventListener("click", () => {
  signInAnonymously(auth)
    .then(() => {
      formMsg.textContent = "تم تسجيل الدخول بنجاح ✅";
    })
    .catch((error) => {
      formMsg.textContent = "حدث خطأ أثناء تسجيل الدخول ❌";
      console.error(error);
    });
});

// حفظ رقم المستخدم بعد تسجيل الدخول
onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
  }
});

// إرسال المشاركة إلى قاعدة البيانات
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const city = document.getElementById("city").value;
  const description = document.getElementById("description").value;

  try {
    await addDoc(collection(db, "posts"), {
      title,
      city,
      description,
      userId,
      createdAt: new Date()
    });

    form.reset();
    formMsg.textContent = "✅ تم نشر المشاركة بنجاح!";
    loadPosts();
  } catch (error) {
    formMsg.textContent = "❌ حدث خطأ أثناء النشر";
    console.error(error);
  }
});

// تحميل المشاركات من قاعدة البيانات
async function loadPosts() {
  postsDiv.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "posts"));
  if (querySnapshot.empty) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = <h4>${data.title}</h4><p>${data.description || ""}</p><small>${data.city || ""}</small>;
      postsDiv.appendChild(div);
    });
  }
}

loadPosts();

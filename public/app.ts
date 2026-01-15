// تعريف واجهة لإعدادات Firebase
interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
}

const config: FirebaseConfig = {
    apiKey: "AIzaSyAR1rdxhN88u7tsc0juOsu...", 
    authDomain: "eeighaa-ebcd1.firebaseapp.com",
    databaseURL: "https://eeighaa-ebcd1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "eeighaa-ebcd1",
    storageBucket: "eeighaa-ebcd1.firebasestorage.app"
};

// تشغيل Firebase (نحتاج لاستخدام الكائن المتاح عالمياً)
declare var firebase: any;
firebase.initializeApp(config);
const db = firebase.database();

// عناصر الواجهة
const btn = document.getElementById('pulseBtn') as HTMLDivElement;
const countDisplay = document.getElementById('globalCount') as HTMLSpanElement;
const statusText = document.getElementById('status') as HTMLParagraphElement;

// وظيفة الإرسال بتحديد النوع
const sendPulse = (): void => {
    db.ref('global_pulses').transaction((current: number | null) => (current || 0) + 1);
    statusText.innerText = "تم إرسال نبضة ذكية! ✅";
    if (navigator.vibrate) navigator.vibrate(70);
};

btn.addEventListener('click', sendPulse);

// الاستماع للبيانات
db.ref('global_pulses').on('value', (snapshot: any) => {
    countDisplay.innerText = snapshot.val() || 0;
    statusText.innerText = "متصل بالسحابة ☁️";
});

// إعدادات Firebase
interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
}

const config: FirebaseConfig = {
    apiKey: "AIzaSyAR1rdxhN88u7tsc0juOsu...", 
    authDomain: "eeighaa-ebcd1.firebaseapp.com",
    databaseURL: "https://eeighaa-ebcd1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "eeighaa-ebcd1"
};

// تعريف Firebase
declare var firebase: any;
firebase.initializeApp(config);

// استخدام 'db' ليتوافق مع الخطأ في الصورة
const db = firebase.database();

// تعريف العناصر بالأسماء التي اشتكى المترجم من فقدانها
const pulseBtn = document.getElementById('pulseBtn') as HTMLDivElement;
const countDisplay = document.getElementById('globalCount') as HTMLSpanElement;
const statusText = document.getElementById('status') as HTMLParagraphElement;

const sendPulse = (): void => {
    db.ref('global_pulses').transaction((c: number | null) => (c || 0) + 1);
    if (statusText) statusText.innerText = "تم إرسال نبضة ذكية! ✅";
    if (navigator.vibrate) navigator.vibrate(70);
};

if (pulseBtn) pulseBtn.addEventListener('click', sendPulse);

db.ref('global_pulses').on('value', (snap: any) => {
    if (countDisplay) countDisplay.innerText = snap.val() || 0;
    if (statusText) statusText.innerText = "متصل بالسحابة (TS) ☁️";
});
    if (globalDisplay) {
        globalDisplay.innerText = snapshot.val() || 0;
    }
});
// الاستماع للبيانات
db.ref('global_pulses').on('value', (snapshot: any) => {
    countDisplay.innerText = snapshot.val() || 0;
    statusText.innerText = "متصل بالسحابة ☁️";
});

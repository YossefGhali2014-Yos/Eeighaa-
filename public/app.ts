// 1. إعدادات Firebase
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

// 2. تهيئة التطبيق
declare var firebase: any;
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}
const db = firebase.database();

// 3. تعريف العناصر
const pulseBtn = document.getElementById('pulseBtn') as HTMLDivElement;
const countDisplay = document.getElementById('globalCount') as HTMLSpanElement;
const statusText = document.getElementById('status') as HTMLParagraphElement;

// 4. وظيفة النبض
function sendPulse(): void {
    db.ref('global_pulses').transaction((current: number | null) => (current || 0) + 1);
    if (statusText) {
        statusText.innerText = "تم إرسال نبضة ذكية! ✅";
        setTimeout(() => {
            statusText.innerText = "متصل بالسحابة (TS) ☁️";
        }, 1000);
    }
    if (navigator.vibrate) {
        navigator.vibrate(70);
    }
}

// 5. ربط الأحداث
if (pulseBtn) {
    pulseBtn.addEventListener('click', sendPulse);
}

// 6. الاستماع للبيانات العالمية
db.ref('global_pulses').on('value', (snapshot: any) => {
    if (countDisplay) {
        countDisplay.innerText = snapshot.val() || 0;
    }
});
if (pulseBtn) {
    pulseBtn.onclick = sendPulse;
}

db.ref('global_pulses').on('value', (snapshot: any) => {
    if (countDisplay) {
        countDisplay.innerText = snapshot.val() || 0;
    }
});
if (pulseBtn) {
    pulseBtn.onclick = sendPulse;
}

db.ref('global_pulses').on('value', (snapshot: any) => {
    if (countDisplay) {
        countDisplay.innerText = snapshot.val() || 0;
    }
});
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

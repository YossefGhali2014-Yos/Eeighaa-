// 1. الإعدادات
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

// 2. التهيئة
declare var firebase: any;
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}
const db = firebase.database();

// 3. العناصر
const pulseBtn = document.getElementById('pulseBtn') as HTMLDivElement;
const countDisplay = document.getElementById('globalCount') as HTMLSpanElement;
const statusText = document.getElementById('status') as HTMLParagraphElement;

// 4. الوظيفة
function sendPulse(): void {
    db.ref('global_pulses').transaction((current: number | null) => (current || 0) + 1);
    if (statusText) {
        statusText.innerText = "تم إرسال نبضة ذكية! ✅";
        setTimeout(() => { statusText.innerText = "متصل بالسحابة (TS) ☁️"; }, 1000);
    }
    if (navigator.vibrate) navigator.vibrate(70);
}

// 5. التنفيذ
if (pulseBtn) {
    pulseBtn.addEventListener('click', sendPulse);
}

db.ref('global_pulses').on('value', (snapshot: any) => {
    if (countDisplay) {
        countDisplay.innerText = snapshot.val() || 0;
    }
});

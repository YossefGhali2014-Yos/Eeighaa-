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

declare var firebase: any;
if (!firebase.apps.length) { firebase.initializeApp(config); }
const db = firebase.database();

const pulseBtn = document.getElementById('pulseBtn') as HTMLDivElement;
const countDisplay = document.getElementById('globalCount') as HTMLSpanElement;
const statusText = document.getElementById('status') as HTMLParagraphElement;

// متغيرات لقياس السرعة (الشعور)
let lastClickTime = 0;
let energy = 0;

function sendPulse(): void {
    const now = Date.now();
    const diff = now - lastClickTime;
    lastClickTime = now;

    // إذا كان الفرق أقل من 300 مللي ثانية، الشخص متحمس!
    if (diff < 300) {
        energy = Math.min(energy + 20, 100); // زيادة الطاقة
    } else {
        energy = Math.max(energy - 10, 0); // هدوء
    }

    // تحديث شكل الدائرة بناءً على "الطاقة"
    if (pulseBtn) {
        pulseBtn.style.boxShadow = `0 0 ${20 + energy}px #9d50bb`;
        pulseBtn.style.filter = `brightness(${1 + energy/100})`;
    }

    db.ref('global_pulses').transaction((c: number | null) => (c || 0) + 1);
    
    if (statusText) {
        statusText.innerText = energy > 50 ? "إيقاع حماسي! 🔥" : "إيقاع هادئ.. ✨";
    }

    if (navigator.vibrate) navigator.vibrate(energy > 50 ? 100 : 50);
}

if (pulseBtn) { pulseBtn.addEventListener('click', sendPulse); }

db.ref('global_pulses').on('value', (snap: any) => {
    if (countDisplay) countDisplay.innerText = snap.val() || 0;
});

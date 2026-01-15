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

let energy = 0;
let lastClick = 0;

function sendPulse(): void {
    const now = Date.now();
    const gap = now - lastClick;
    lastClick = now;

    // معادلة الطاقة: كلما قل الفارق عن 100ms (سرعة الـ Auto Clicker) زاد التوهج
    if (gap < 150) {
        energy = Math.min(energy + 15, 200); 
    } else {
        energy = Math.max(energy - 5, 0);
    }

    if (pulseBtn) {
        // تغيير اللون بناءً على الطاقة (من البنفسجي للأحمر المتوهج)
        const glowColor = energy > 100 ? '#ff0080' : '#9d50bb';
        pulseBtn.style.boxShadow = `0 0 ${20 + energy}px ${glowColor}`;
        pulseBtn.style.transform = `scale(${1 + (energy / 500)})`; // الدائرة تكبر مع الحماس
        pulseBtn.style.background = `radial-gradient(circle, ${glowColor}, #6e48aa)`;
    }

    db.ref('global_pulses').transaction((c: number | null) => (c || 0) + 1);
    
    if (statusText) {
        if (energy > 150) statusText.innerText = "وضع الـ Supernova! 💥";
        else if (energy > 50) statusText.innerText = "حماس مفرط! 🔥";
        else statusText.innerText = "نبض مستقر.. ✨";
    }
}

if (pulseBtn) { pulseBtn.addEventListener('click', sendPulse); }

db.ref('global_pulses').on('value', (snap: any) => {
    if (countDisplay) countDisplay.innerText = snap.val() || 0;
});

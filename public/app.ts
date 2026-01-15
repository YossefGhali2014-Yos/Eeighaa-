// 1. الإعدادات
interface FirebaseConfig {
    apiKey: string; authDomain: string; databaseURL: string; projectId: string;
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
const statusText = document.getElementById('status') as HTMLDivElement;

let energy = 0;

// 2. محرك الرسم (هنا يكمن الشعور)
function render() {
    if (pulseBtn) {
        const scale = 1 + (energy / 400); // الدائرة تكبر مع الضغط
        const glow = 15 + (energy / 1.5); // التوهج يزداد
        const hue = 280 - (energy / 2);    // اللون يتغير قليلاً
        
        pulseBtn.style.transform = `scale(${scale})`;
        pulseBtn.style.boxShadow = `0 0 ${glow}px hsla(${hue}, 80%, 60%, 0.9)`;
        
        // استنزاف الطاقة تدريجياً لخلق حركة النبض
        if (energy > 0) energy -= 2.5;
    }
    requestAnimationFrame(render);
}

render();

// 3. معالج الضغطات (يدعم 1ms واللمس)
function triggerPulse(e: Event) {
    e.preventDefault();
    energy = Math.min(energy + 12, 350); // شحن الطاقة فوراً

    if (statusText) {
        statusText.innerText = energy > 200 ? "وضع الانفجار! 🔥" : "تم إرسال نبضة! ✅";
    }

    db.ref('global_pulses').transaction((c: number | null) => (c || 0) + 1);
}

if (pulseBtn) {
    pulseBtn.addEventListener('mousedown', triggerPulse);
    pulseBtn.addEventListener('touchstart', triggerPulse);
}

// 4. تحديث العداد العالمي
db.ref('global_pulses').on('value', (snap: any) => {
    if (countDisplay) countDisplay.innerText = snap.val() || 0;
});

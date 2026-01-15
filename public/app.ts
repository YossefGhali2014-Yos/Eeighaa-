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

// محرك الرسم المستقل - يضمن ظهور التوهج مهما كانت سرعة الـ Auto Clicker
function animate() {
    if (pulseBtn) {
        // تأثير التوهج والحجم بناءً على "طاقة" الضغطات
        const glow = 15 + (energy / 1.5);
        const scale = 1 + (energy / 400);
        const brightness = 100 + (energy / 2);
        
        // تحول اللون للوردي المحمر عند الانفجار
        const hue = 280 - (energy / 2); 
        
        pulseBtn.style.boxShadow = `0 0 ${glow}px hsla(${hue}, 80%, 60%, 0.9)`;
        pulseBtn.style.transform = `scale(${scale})`;
        pulseBtn.style.filter = `brightness(${brightness}%)`;
        
        // استنزاف الطاقة تدريجياً لخلق تأثير "النبض"
        if (energy > 0) energy -= 2;
    }
    requestAnimationFrame(animate);
}

animate();

function triggerPulse(e: Event) {
    e.preventDefault();
    // زيادة الطاقة: مع 1ms ستصل للـ 300 بسرعة وتحدث الانفجار
    energy = Math.min(energy + 12, 350);

    if (statusText) {
        if (energy > 200) statusText.innerText = "وضع الانفجار! 🔥";
        else statusText.innerText = "إيقاع نشط ✨";
    }

    db.ref('global_pulses').transaction((c: number | null) => (c || 0) + 1);
}

if (pulseBtn) {
    // استخدام أحداث سريعة جداً لدعم الـ Auto Clicker واللمس
    pulseBtn.addEventListener('mousedown', triggerPulse);
    pulseBtn.addEventListener('touchstart', triggerPulse);
}

db.ref('global_pulses').on('value', (snap: any) => {
    if (countDisplay) countDisplay.innerText = snap.val() || 0;
});

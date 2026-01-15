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

function animate() {
    if (pulseBtn) {
        // 1. حساب التأثيرات الأساسية (موجودة لديك)
        const scale = 1 + (energy / 350);
        const glow = 20 + (energy / 1.2);
        const hue = 280 - (energy / 2);
        
        // 2. إحساس "الزلزال": اهتزاز الشاشة عند الحماس العالي (جديد)
        const shake = energy > 200 ? (Math.random() * 10 - 5) : 0;
        
        // 3. تطبيق التأثيرات مع الاهتزاز
        pulseBtn.style.transform = `scale(${scale}) translate(${shake}px, ${shake}px)`;
        pulseBtn.style.boxShadow = `0 0 ${glow}px hsla(${hue}, 85%, 65%, 0.9)`;
        
        // 4. إحساس "تغير الزمان": الخلفية تتحول للأرجواني مع السرعة (جديد)
        document.body.style.backgroundColor = `rgb(${energy/4}, 17, ${23 + energy/8})`;

        if (energy > 0) energy -= 2.8;
    }
    requestAnimationFrame(animate);
}


animate();

function handleAction(e: Event) {
    e.preventDefault();
    energy = Math.min(energy + 15, 450); // شحن الطاقة

    db.ref('global_pulses').transaction((c: number | null) => (c || 0) + 1);
    
    if (statusText) {
        statusText.style.opacity = "1";
        statusText.innerText = energy > 200 ? "وضع الانفجار الشعوري! 🔥" : "تم إرسال نبضة ذكية! ✅";
    }
}

if (pulseBtn) {
    // أحداث فورية تدعم الـ Auto Clicker واللمس
    pulseBtn.addEventListener('mousedown', handleAction);
    pulseBtn.addEventListener('touchstart', handleAction);
}

db.ref('global_pulses').on('value', (snap: any) => {
    if (countDisplay) countDisplay.innerText = snap.val() || 0;
});

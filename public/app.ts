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

let visualEnergy = 0;

// محرك الرسم: يعمل بتردد 60 إطار في الثانية مهما كانت سرعة الضغط
function renderLoop() {
    if (pulseBtn) {
        // حساب التوهج: من البنفسجي إلى الأبيض المتوهج عند 1ms
        const hue = Math.max(280 - visualEnergy, 0); // يتحول للون أفتح
        const brightness = 100 + Math.min(visualEnergy, 150);
        
        pulseBtn.style.boxShadow = `0 0 ${10 + visualEnergy/2}px hsla(${hue}, 70%, 60%, 0.8)`;
        pulseBtn.style.transform = `scale(${1 + Math.min(visualEnergy/500, 0.4)})`;
        pulseBtn.style.filter = `brightness(${brightness}%)`;
    }

    // تقليل الطاقة تدريجياً لضمان "هبوط" ناعم بعد توقف الـ Auto Clicker
    visualEnergy = Math.max(visualEnergy - 1.5, 0);
    requestAnimationFrame(renderLoop);
}

renderLoop();

function sendPulse(): void {
    // زيادة الطاقة: مع 1ms، ستصل الطاقة لقمة مستواها في أجزاء من الثانية
    visualEnergy = Math.min(visualEnergy + 5, 400); 

    // تحديث قاعدة البيانات
    db.ref('global_pulses').transaction((c: number | null) => (c || 0) + 1);
}

if (pulseBtn) {
    pulseBtn.addEventListener('click', sendPulse);
}

db.ref('global_pulses').on('value', (snap: any) => {
    if (countDisplay) countDisplay.innerText = snap.val() || 0;
});

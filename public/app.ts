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
const statusText = document.getElementById('status') as HTMLParagraphElement;

let energy = 0;

function updateVisuals() {
    if (pulseBtn) {
        // إذا كانت الطاقة عالية، نتحول للون الأحمر المتوهج فوراً
        const intensity = Math.min(energy, 255);
        const color = energy > 100 ? `rgb(255, ${255 - intensity}, ${intensity})` : '#9d50bb';
        
        pulseBtn.style.boxShadow = `0 0 ${20 + energy}px ${color}`;
        pulseBtn.style.transform = `scale(${1 + (energy / 400)})`;
        pulseBtn.style.filter = `brightness(${1 + energy/100})`;
    }
    
    // تقليل الطاقة تدريجياً لخلق تأثير النبض
    energy = Math.max(energy - 2, 0);
    requestAnimationFrame(updateVisuals);
}

// بدء حلقة التحديث البصري
updateVisuals();

function sendPulse(): void {
    // مع كل ضغطة، نقفز بالطاقة فوراً
    energy = Math.min(energy + 30, 300); 

    db.ref('global_pulses').transaction((c: number | null) => (c || 0) + 1);
    
    if (statusText) {
        statusText.innerText = energy > 150 ? "انفجار شعوري! 💥" : "نبض حي.. ✨";
    }
    
    if (navigator.vibrate) navigator.vibrate(energy > 100 ? 50 : 20);
}

if (pulseBtn) { pulseBtn.addEventListener('click', sendPulse); }

db.ref('global_pulses').on('value', (snap: any) => {
    if (countDisplay) countDisplay.innerText = snap.val() || 0;
});

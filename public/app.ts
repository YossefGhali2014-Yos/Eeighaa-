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
        const scale = 1 + (energy / 300);
        const glow = 20 + (energy / 1.1);
        const hue = 280 - (energy / 2);
        
        // إحساس الزلزال (Screen Shake) 🫨
        const shake = energy > 180 ? (Math.random() * 14 - 7) : 0;
        
        pulseBtn.style.transform = `scale(${scale}) translate(${shake}px, ${shake}px)`;
        pulseBtn.style.boxShadow = `0 0 ${glow}px hsla(${hue}, 90%, 65%, 0.9)`;
        
        // إحساس تغير الزمان (Background Color) 🌌
        if (energy > 50) {
            document.body.style.backgroundColor = `rgb(${energy/3}, 10, ${25 + energy/10})`;
        } else {
            document.body.style.backgroundColor = "#0d1117";
        }

        if (energy > 0) energy -= 2.5;
    }
    requestAnimationFrame(animate);
}

animate();

function handleAction(e: Event) {
    e.preventDefault();
    energy = Math.min(energy + 18, 500); // زيادة الحساسية للـ 1ms
    db.ref('global_pulses').transaction((c: number | null) => (c || 0) + 1);
    
    if (statusText) {
        statusText.innerText = energy > 250 ? "انفجار زلزالي!! 🫨🔥" : "نبضة قوية ✅";
    }
}

if (pulseBtn) {
    pulseBtn.addEventListener('mousedown', handleAction);
    pulseBtn.addEventListener('touchstart', handleAction);
}

db.ref('global_pulses').on('value', (snap: any) => {
    if (countDisplay) countDisplay.innerText = snap.val() || 0;
});

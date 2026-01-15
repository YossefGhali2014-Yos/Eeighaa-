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
        
        // إحساس الاهتزاز (الزلزال) عند الغضب أو السرعة القصوى
        const shake = energy > 200 ? (Math.random() * 10 - 5) : 0;
        
        pulseBtn.style.transform = `scale(${scale}) translate(${shake}px, ${shake}px)`;
        
        // تغيير الألوان بناءً على "الشعور"
        if (energy > 250) {
            // شعور: انفجار/غضب 🔥
            pulseBtn.style.boxShadow = `0 0 ${glow}px #ff0000`;
            document.body.style.backgroundColor = "#2a0000"; 
            if (statusText) statusText.innerText = "أنت منفجر طاقة! 💥🔥";
        } else if (energy > 100) {
            // شعور: حماس/سعادة ✨
            pulseBtn.style.boxShadow = `0 0 ${glow}px #ff00ff`;
            document.body.style.backgroundColor = "#1a0b2e";
            if (statusText) statusText.innerText = "يا له من حماس! ✨🚀";
        } else {
            // شعور: هدوء/تركيز 🌊
            pulseBtn.style.boxShadow = `0 0 ${glow}px #9d50bb`;
            document.body.style.backgroundColor = "#0d1117";
            if (statusText) statusText.innerText = energy > 10 ? "نبض هادئ.. ✨" : "جاهز لاستقبال شعورك..";
        }

        if (energy > 0) energy -= 2.5;
    }
    requestAnimationFrame(animate);
}

animate();

function handleAction(e: Event) {
    e.preventDefault();
    energy = Math.min(energy + 15, 500); 
    db.ref('global_pulses').transaction((c: number | null) => (c || 0) + 1);
}

if (pulseBtn) {
    pulseBtn.addEventListener('mousedown', handleAction);
    pulseBtn.addEventListener('touchstart', handleAction);
}

db.ref('global_pulses').on('value', (snap: any) => {
    if (countDisplay) countDisplay.innerText = snap.val() || 0;
});

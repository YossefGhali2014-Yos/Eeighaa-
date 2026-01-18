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
let lastMood = "جاهز لاستقبال شعورك..";
let highScore = Number(localStorage.getItem('highScore')) || 0; // استرجاع الرقم القياسي

function animate() {
    if (pulseBtn) {
        const scale = 1 + (energy / 300);
        const glow = 20 + (energy / 1.1);
        const shake = energy > 200 ? (Math.random() * 12 - 6) : 0;
        
        pulseBtn.style.transform = `scale(${scale}) translate(${shake}px, ${shake}px)`;
        
        // التحقق من كسر الرقم القياسي
        if (energy > highScore) {
            highScore = Math.floor(energy);
            localStorage.setItem('highScore', highScore.toString());
        }

        if (energy > 250) {
            pulseBtn.style.boxShadow = `0 0 ${glow}px #ff0000`;
            document.body.style.backgroundColor = "#2a0000"; 
            lastMood = `تحطيم أرقام! 🔥 (${highScore})`;
        } else if (energy > 100) {
            pulseBtn.style.boxShadow = `0 0 ${glow}px #ff00ff`;
            document.body.style.backgroundColor = "#1a0b2e";
            lastMood = `حماس مستمر ✨ (الرقم: ${highScore})`;
        } else {
            pulseBtn.style.boxShadow = `0 0 ${glow}px #9d50bb`;
            document.body.style.backgroundColor = "#0d1117";
            lastMood = highScore > 0 ? `هدوء.. قياسك: ${highScore}` : "ابدأ لصنع رقمك القياسي!";
        }

        if (statusText) statusText.innerText = lastMood;
        if (energy > 0) energy -= 2.0; 
    }
    requestAnimationFrame(animate);
}

animate();

function handleAction(e: Event) {
    e.preventDefault();
    energy = Math.min(energy + 18, 500); 

    // إضافة اهتزاز للهاتف عند الطاقة العالية (واقعية أكثر)
    if (energy > 200 && navigator.vibrate) {
        navigator.vibrate(50); // يهتز لمدة 50 مللي ثانية
    }

    db.ref('global_pulses').transaction((c: number | null) => (c || 0) + 1);
}

db.ref('global_pulses').on('value', (snap: any) => {
    if (countDisplay) countDisplay.innerText = snap.val() || 0;
});

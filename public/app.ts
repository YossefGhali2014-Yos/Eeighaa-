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

// عناصر الواجهة
const pulseBtn = document.getElementById('pulseBtn') as HTMLDivElement;
const countDisplay = document.getElementById('globalCount') as HTMLSpanElement;
const statusText = document.getElementById('status') as HTMLDivElement;
const nameOverlay = document.getElementById('nameOverlay') as HTMLDivElement;
const userNameInput = document.getElementById('userNameInput') as HTMLInputElement;
const startBtn = document.getElementById('startBtn') as HTMLButtonElement;

// المتغيرات الأساسية
let energy = 0;
let lastMood = "جاهز..";
let highScore = Number(localStorage.getItem('highScore')) || 0;
let currentUserName = localStorage.getItem('userName') || "";

// نظام التحقق من الاسم
if (currentUserName) {
    nameOverlay.style.display = "none";
}

startBtn.onclick = () => {
    const val = userNameInput.value.trim();
    if (val) {
        currentUserName = val;
        localStorage.setItem('userName', currentUserName);
        nameOverlay.style.display = "none";
    }
};

function animate() {
    if (pulseBtn) {
        const scale = 1 + (energy / 300);
        const glow = 20 + (energy / 1.1);
        const shake = energy > 200 ? (Math.random() * 12 - 6) : 0;
        
        pulseBtn.style.transform = `scale(${scale}) translate(${shake}px, ${shake}px)`;
        
        // تحديث الرقم القياسي في اللحظة
        if (energy > highScore) {
            highScore = Math.floor(energy);
            localStorage.setItem('highScore', highScore.toString());
        }

        // تحديد الحالة بناءً على الطاقة والاسم
        if (energy > 250) {
            pulseBtn.style.boxShadow = `0 0 ${glow}px #ff0000`;
            document.body.style.backgroundColor = "#2a0000"; 
            lastMood = `يا ${currentUserName}.. انفجار! 🔥 (${highScore})`;
        } else if (energy > 100) {
            pulseBtn.style.boxShadow = `0 0 ${glow}px #ff00ff`;
            document.body.style.backgroundColor = "#1a0b2e";
            lastMood = `حماس يا ${currentUserName} ✨ (الرقم: ${highScore})`;
        } else {
            pulseBtn.style.boxShadow = `0 0 ${glow}px #9d50bb`;
            document.body.style.backgroundColor = "#0d1117";
            lastMood = currentUserName ? `أهلاً ${currentUserName}.. قياسك: ${highScore}` : "ابدأ النبض!";
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
    
    // اهتزاز حقيقي للهاتف عند القوة العالية
    if (energy > 220 && navigator.vibrate) {
        navigator.vibrate(40);
    }
    
    db.ref('global_pulses').transaction((c: number | null) => (c || 0) + 1);
}

if (pulseBtn) {
    pulseBtn.addEventListener('mousedown', handleAction);
    pulseBtn.addEventListener('touchstart', handleAction);
}

db.ref('global_pulses').on('value', (snap: any) => {
    if (countDisplay) countDisplay.innerText = snap.val() || 0;
});

// تعريف هيكل البيانات لـ Firebase لضمان عدم وجود أخطاء إملائية
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

// إخبار TypeScript أن كائن firebase معرف عالمياً
declare var firebase: any;
firebase.initializeApp(config);
const database = firebase.database();

// تحديد أنواع العناصر لضمان وجودها في الصفحة
const pulseBtn = document.getElementById('pulseBtn') as HTMLDivElement;
const globalDisplay = document.getElementById('globalCount') as HTMLSpanElement;

const sendPulse = (): void => {
    // استخدام الـ Transaction لضمان دقة العداد العالمي
    database.ref('global_pulses').transaction((count: number | null) => (count || 0) + 1);
    if (navigator.vibrate) navigator.vibrate(70);
};

if (pulseBtn) {
    pulseBtn.addEventListener('click', sendPulse);
}

// الاستماع للنبضات وتحديث الواجهة فوراً
database.ref('global_pulses').on('value', (snapshot: any) => {
    if (globalDisplay) {
        globalDisplay.innerText = snapshot.val() || 0;
    }
});
// الاستماع للبيانات
db.ref('global_pulses').on('value', (snapshot: any) => {
    countDisplay.innerText = snapshot.val() || 0;
    statusText.innerText = "متصل بالسحابة ☁️";
});

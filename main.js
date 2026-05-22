const endpoint = "http://192.168.1.3";


function setLampRight() {
    fetch(endpoint + "/lampright", {
        method: "POST"
    }).then(Response => Response.text()).then(result => console.log(result))
    const btn = document.getElementById("btnRight");

    if (ledRightImage.src.includes("led-on.png")) {
        // kondisi OFF
        ledKanan.style.backgroundColor = "";
        ledRightImage.src = "./asset/led-off.png";
        ledKanan.parentElement.style.backgroundColor = "";
        ledKanan.innerText = "TURN ON";

    } else {
        // kondisi ON
        ledKanan.style.backgroundColor = "#0026ff";
        ledRightImage.src = "./asset/led-on.png";
        ledKanan.parentElement.style.backgroundColor = "white";
        ledKanan.innerText = "TURN OFF"; // <-- tambah ini
    }
}

function setLampLeft() {
    fetch(endpoint + "/lampleft", {
        method: "POST"
    }).then(Response => Response.text()).then(result => console.log(result))
    const btn = document.getElementById("btnLeft");

    if (ledLeftImage.src.includes("led-on.png")) {
        // kondisi OFF
        ledKiri.style.backgroundColor = "";
        ledLeftImage.src = "./asset/led-off.png";
        ledKiri.parentElement.style.backgroundColor = "";
        ledKiri.innerText = "TURN ON";

    } else {
        // kondisi ON
        ledKiri.style.backgroundColor = "#0026ff";
        ledLeftImage.src = "./asset/led-on.png";
        ledKiri.parentElement.style.backgroundColor = "white";
        ledKiri.innerText = "TURN OFF"; // <-- tambah ini
    }
}

function updateData() {

    const coolant = randomRange(70, 105);
    const map = randomRange(20, 110);
    const rpm = randomRange(1000, 6000);
    const speed = randomRange(0, 180);
    const iat = randomRange(10, 50);
    const maf = randomRange(2, 30);
    const fuel = randomRange(0, 100);
    const led = randomRange(0, 100);

    // helper aman
    function setText(id, value) {

        const el = document.getElementById(id);

        if (el) {
            el.innerText = value;
        }
    }

    // LIVE DATA
    setText("coolant", coolant);
    setText("map", map);
    setText("rpm", rpm);
    setText("speed", speed);
    setText("iat", iat);
    setText("maf", maf);
    setText("led", led);

    // fuel
    setText("fuel", fuel);

    // fuel bar
    const fuelBar = document.getElementById("fuelBar");

    if (fuelBar) {
        fuelBar.style.width = fuel + "%";
    }

    // speedometer
    if (typeof updateSpeedometer === "function") {
        updateSpeedometer(speed);
    }
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// update tiap 1 detik
// hanya jalan jika halaman punya live data
if (
    document.getElementById("coolant") ||
    document.getElementById("map")
) {
    setInterval(updateData, 5000);
    updateData();
}

/* ========================================= */
/* SMART CAR HISTORY SYSTEM */
/* ========================================= */

/*
    DATA TIDAK BERUBAH
    DATA DISIMPAN PER JAM
    BISA MELIHAT SAMPAI 10 TAHUN KE BELAKANG
*/

const STORAGE_KEY = "smartcar_history";

/* ========================================= */
/* GENERATE DATA */
/* ========================================= */

function generateFixedData(dateKey) {

    let seed = 0;

    for (let i = 0; i < dateKey.length; i++) {
        seed += dateKey.charCodeAt(i);
    }

    return {

        coolant: 70 + (seed % 25),

        manifold: 50 + (seed % 40),

        rpm: 1000 + ((seed * 13) % 7000),

        speed: 20 + ((seed * 7) % 220),

        intake: 10 + (seed % 25),

        maf: 5 + (seed % 50),

        fuel: 5 + (seed % 90),

        led: 1 + (seed % 10),
    };
}

/* ========================================= */
/* LOAD DATABASE */
/* ========================================= */

function getDatabase() {

    const db = localStorage.getItem(STORAGE_KEY);

    if (db) {
        return JSON.parse(db);
    }

    return {};
}

/* ========================================= */
/* SAVE DATABASE */
/* ========================================= */

function saveDatabase(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ========================================= */
/* SAVE CURRENT HOUR DATA */
/* ========================================= */

function saveCurrentHourData() {

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");

const minute = String(now.getMinutes()).padStart(2, "0");

const key =
`${year}-${month}-${day}-${hour}-${minute}`;

    const db = getDatabase();

    /*
        jika data belum ada
        maka simpan sekali saja
    */

    if (!db[key]) {

        db[key] = generateFixedData(key);

        saveDatabase(db);

    }
}

/* ========================================= */
/* LOAD DATA */
/* ========================================= */

function loadHistoryData() {

    const dateInput = document.getElementById("historyDate").value;
    const timeInput = document.getElementById("historyTime").value;

    if (!dateInput || !timeInput) {
        alert("Pilih tanggal dan jam");
        return;
    }

const [hour, minute] = timeInput.split(":");

const key = `${dateInput}-${hour}-${minute}`;

    const db = getDatabase();

    let data = db[key];

    /*
        jika belum ada data lama
        generate permanen sekali
    */

    if (!data) {

        data = generateFixedData(key);

        db[key] = data;

        saveDatabase(db);
    }

    /* tampilkan */

    document.getElementById("coolantValue").innerText = data.coolant;
    document.getElementById("manifoldValue").innerText = data.manifold;
    document.getElementById("rpmValue").innerText = data.rpm;
    document.getElementById("speedValue").innerText = data.speed;
    document.getElementById("intakeValue").innerText = data.intake;
    document.getElementById("mafValue").innerText = data.maf;
    document.getElementById("fuelValue").innerText = data.fuel;
    document.getElementById("ledValue").innerText = data.led;
}

/* ========================================= */
/* INIT */
/* ========================================= */

function initDateTime() {

    const now = new Date();

    const maxDate = new Date();
    const minDate = new Date();

    minDate.setFullYear(now.getFullYear() - 10);

    const formatDate = (d) => {

        const y = d.getFullYear();

        const m = String(d.getMonth() + 1).padStart(2, "0");

        const da = String(d.getDate()).padStart(2, "0");

        return `${y}-${m}-${da}`;
    };

    document.getElementById("historyDate").min = formatDate(minDate);

    document.getElementById("historyDate").max = formatDate(maxDate);

    document.getElementById("historyDate").value = formatDate(now);

    document.getElementById("historyTime").value =
        `${String(now.getHours()).padStart(2, "0")}:00`;
}

/* ========================================= */
/* BUTTON */
/* ========================================= */

const loadBtn = document.getElementById("loadHistory");

if (loadBtn) {
    loadBtn.addEventListener("click", loadHistoryData);
}

/* ========================================= */
/* AUTO SAVE */
/* ========================================= */

/*
    setiap buka web
    simpan data jam sekarang
*/

saveCurrentHourData();

/*
    auto simpan tiap 1 jam
*/

setInterval(() => {

    saveCurrentHourData();

}, 60000);

/* ========================================= */
/* START */
/* ========================================= */

if (document.getElementById("historyDate")) {

    initDateTime();

    loadHistoryData();
}

/* =========================
   LOGIN CHECK
========================= */

const isLogin = localStorage.getItem("isLogin");

const currentPage =
window.location.pathname.split("/").pop();

if(
    isLogin !== "true" &&
    currentPage !== "login.html"
){
    window.location.href = "login.html";
}

function logout(){

    localStorage.removeItem("isLogin");

    window.location.href = "login.html";
}

/* =========================
   ACCOUNT SYSTEM
========================= */

/*
    load data akun
*/

function loadAccount(){

    const currentUser =
    localStorage.getItem("currentUser");

    if(!currentUser) return;

    const users =
    JSON.parse(localStorage.getItem("users")) || {};

    const user = users[currentUser];

    if(!user) return;

    const usernameInput =
    document.getElementById("usernameInput");

    const emailInput =
    document.getElementById("emailInput");

    const passwordInput =
    document.getElementById("passwordInput");

    if(usernameInput){
        usernameInput.value = user.username;
    }

    if(emailInput){
        emailInput.value = user.email;
    }

    if(passwordInput){
        passwordInput.value = user.password;
    }
}

/*
    simpan akun
*/

function saveAccount(){

    const currentUser =
    localStorage.getItem("currentUser");

    let users =
    JSON.parse(localStorage.getItem("users")) || {};

    if(!users[currentUser]) return;

    const newEmail =
    document.getElementById("emailInput").value;

    const updatedUser = {

        username:
        document.getElementById("usernameInput").value,

        email: newEmail,

        password:
        document.getElementById("passwordInput").value
    };

    /*
        hapus email lama
    */

    delete users[currentUser];

    /*
        simpan email baru
    */

    users[newEmail] = updatedUser;

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    /*
        update user aktif
    */

    localStorage.setItem(
        "currentUser",
        newEmail
    );

    alert("Data akun berhasil disimpan");
}

/*
    auto load akun
*/

loadAccount();

const micBtn = document.getElementById("micBtn");
const voiceText = document.getElementById("voiceText");
const commandIcon = document.getElementById("commandIcon");

let recognition;
let isRecording = false;

// Cek apakah browser mendukung voice recognition
if (micBtn && voiceText && commandIcon && "webkitSpeechRecognition" in window) {

    recognition = new webkitSpeechRecognition();
    recognition.lang = "id-ID";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function () {
        isRecording = true;
        micBtn.classList.add("recording");
        voiceText.innerText = "Mendengarkan perintah...";
    };

    recognition.onresult = function (event) {
        const command = event.results[0][0].transcript.toLowerCase();
        voiceText.innerText = "Perintah: " + command;

        prosesPerintah(command);
    };

    recognition.onerror = function () {
        voiceText.innerText = "Suara tidak terbaca, coba lagi";
        stopMic();
    };

    recognition.onend = function () {
        stopMic();
    };

}  else {
    if (voiceText) {
        voiceText.innerText = "Browser tidak mendukung voice recognition";
    }
}

// Tekan dan tahan mic
if (micBtn) {

    micBtn.addEventListener("mousedown", startMic);
    micBtn.addEventListener("mouseup", stopMic);

    micBtn.addEventListener("touchstart", function(e){
        e.preventDefault();
        startMic();
    });

    micBtn.addEventListener("touchend", function(e){
        e.preventDefault();
        stopMic();
    });
}

function startMic() {
    if (!recognition || isRecording) return;
    recognition.start();
}

function stopMic() {
    isRecording = false;
    micBtn.classList.remove("recording");

    try {
        recognition.stop();
    } catch (e) {}

    voiceText.innerText = "Tekan dan tahan mic untuk memberi perintah";
}

function setButton1() {

    fetch(endpoint + "/button1", {
        method: "POST"
    })
    .then(response => response.text())
    .then(result => {

        console.log(result);

        if(result == "ON") {

            console.log("Jendela 1 aktif");

        } else {

            console.log("Jendela 1 nonaktif");
        }
    });
}

function setButton2() {

    fetch(endpoint + "/button2", {
        method: "POST"
    })
    .then(response => response.text())
    .then(result => {

        console.log(result);

        if(result == "ON") {

            console.log("Jendela 2 aktif");

        } else {

            console.log("Jendela 2 nonaktif");
        }
    });
}

function setButton3() {

    fetch(endpoint + "/button3", {
        method: "POST"
    })
    .then(response => response.text())
    .then(result => {

        console.log(result);

        if(result == "ON") {

            console.log("Jendela 3 aktif");

        } else {

            console.log("Jendela 3 nonaktif");
        }
    });
}

function setButton4() {

    fetch(endpoint + "/button4", {
        method: "POST"
    })
    .then(response => response.text())
    .then(result => {

        console.log(result);

        if(result == "ON") {

            console.log("Jendela 4 aktif");

        } else {

            console.log("Jendela 4 nonaktif");
        }
    });
}

function setButton5() {

    fetch(endpoint + "/button5", {
        method: "POST"
    })
    .then(response => response.text())
    .then(result => {

        console.log(result);

        if(result == "ON") {

            console.log("Jendela 5 aktif");

        } else {

            console.log("Jendela 5 nonaktif");
        }
    });
}

function setButton6() {

    fetch(endpoint + "/button6", {
        method: "POST"
    })
    .then(response => response.text())
    .then(result => {

        console.log(result);

        if(result == "ON") {

            console.log("Jendela 6 aktif");

        } else {

            console.log("Jendela 6 nonaktif");
        }
    });
}

function setButton7() {

    fetch(endpoint + "/button7", {
        method: "POST"
    })
    .then(response => response.text())
    .then(result => {

        console.log(result);

        if(result == "ON") {

            console.log("Jendela 7 aktif");

        } else {

            console.log("Jendela 7 nonaktif");
        }
    });
}

function setButton8() {

    fetch(endpoint + "/button8", {
        method: "POST"
    })
    .then(response => response.text())
    .then(result => {

        console.log(result);

        if(result == "ON") {

            console.log("Jendela 8 aktif");

        } else {

            console.log("Jendela 8 nonaktif");
        }
    });
}

const firebaseURL =
"https://smart-cars-a9536-default-rtdb.asia-southeast1.firebasedatabase.app/smartcar/command.json";

function sendCommand(command){

    fetch(firebaseURL,{
        method:"PUT",
        body:JSON.stringify(command)
    })

    .then(response => response.json())

    .then(data => {

        console.log("Perintah terkirim:", command);

    })

    .catch(error => {

        console.log("Error:", error);

    });
}

/* =========================
   JENDELA KANAN DEPAN
========================= */

function setButton1(){

    sendCommand("WINDOW_RIGHT_FRONT_ON");
}

function setButton2(){

    sendCommand("WINDOW_RIGHT_FRONT_OFF");
}

/* =========================
   JENDELA KIRI DEPAN
========================= */

function setButton3(){

    sendCommand("WINDOW_LEFT_FRONT_ON");
}

function setButton4(){

    sendCommand("WINDOW_LEFT_FRONT_OFF");
}

/* =========================
   JENDELA KIRI BELAKANG
========================= */

function setButton5(){

    sendCommand("WINDOW_LEFT_BACK_ON");
}

function setButton6(){

    sendCommand("WINDOW_LEFT_BACK_OFF");
}

/* =========================
   JENDELA KANAN BELAKANG
========================= */

function setButton7(){

    sendCommand("WINDOW_RIGHT_BACK_ON");
}

function setButton8(){

    sendCommand("WINDOW_RIGHT_BACK_OFF");
}
const endpoint = "http://192.168.1.10";


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



/* =================================================
   TAMBAHAN SMART CAR CONTROL ESP32
   TAMBAHKAN DI PALING BAWAH FILE JS
================================================= */

function kirimESP(path){
    fetch(endpoint + path, {
        method: "POST"
    })
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log("ESP32 ERROR:", error));
}

/* =========================
   LAMP CONTROL
========================= */

let tahanKanan = false;
let tahanKiri = false;
let timerKanan;
let timerKiri;

function lampRightHoldStart(){
    tahanKanan = false;

    timerKanan = setTimeout(function(){
        tahanKanan = true;
        kirimESP("/lamprightbright");
    }, 600);
}

function lampRightHoldEnd(){
    clearTimeout(timerKanan);

    if(tahanKanan){
        kirimESP("/lamprightnormal");
    }
}

function lampLeftHoldStart(){
    tahanKiri = false;

    timerKiri = setTimeout(function(){
        tahanKiri = true;
        kirimESP("/lampleftbright");
    }, 600);
}

function lampLeftHoldEnd(){
    clearTimeout(timerKiri);

    if(tahanKiri){
        kirimESP("/lampleftnormal");
    }
}

/* MODIFIKASI fungsi lama, nama tetap sama */
const setLampRightLama = setLampRight;

setLampRight = function(){

    if(tahanKanan){
        tahanKanan = false;
        return;
    }

    kirimESP("/lampright");

    if (ledRightImage.src.includes("led-on.png")) {
        ledKanan.style.backgroundColor = "";
        ledRightImage.src = "./asset/led-off.png";
        ledKanan.parentElement.style.backgroundColor = "";
        ledKanan.innerText = "TURN ON";
    } else {
        ledKanan.style.backgroundColor = "#0026ff";
        ledRightImage.src = "./asset/led-on.png";
        ledKanan.parentElement.style.backgroundColor = "white";
        ledKanan.innerText = "TURN OFF";
    }
}

const setLampLeftLama = setLampLeft;

setLampLeft = function(){

    if(tahanKiri){
        tahanKiri = false;
        return;
    }

    kirimESP("/lampleft");

    if (ledLeftImage.src.includes("led-on.png")) {
        ledKiri.style.backgroundColor = "";
        ledLeftImage.src = "./asset/led-off.png";
        ledKiri.parentElement.style.backgroundColor = "";
        ledKiri.innerText = "TURN ON";
    } else {
        ledKiri.style.backgroundColor = "#0026ff";
        ledLeftImage.src = "./asset/led-on.png";
        ledKiri.parentElement.style.backgroundColor = "white";
        ledKiri.innerText = "TURN OFF";
    }
}



/* =========================
   RADIO CONTROL
========================= */
function radioForward(){
    kontrolButton("radioforward", "Radio forward");
}

function radioBack(){
    kontrolButton("radioback", "Radio back");
}

function radioSource(){
    kontrolButton("radiosource", "Radio source");
}

function radioSelect(){
    kontrolButton("radioselect", "Radio select");
}

function radioPrevSong(){
    kontrolButton("radioprev", "Radio prev song");
}

function radioNextSong(){
    kontrolButton("radionext", "Radio next song");
}

function radioVolDown(){
    kontrolButton("radiovoldown", "Radio volume down");
}

function radioVolUp(){
    kontrolButton("radiovolup", "Radio volume up");
}

/* =========================
   VOICE CONTROL
========================= */

function prosesPerintah(command){

    command = command.toLowerCase();
    command = command.replace(/-/g, " ");
    command = command.trim();

    console.log("VOICE TERBACA:", command);


  if(command.includes("lampu kanan menyala")){
    kirimCommand("/button1", "BUTTON1");
}
else if(command.includes("lampu kanan mati")){
    kirimCommand("/button2", "BUTTON2");
}
else if(command.includes("lampu kiri menyala")){
    kirimCommand("/button3", "BUTTON3");
}
else if(command.includes("lampu kiri mati")){
    kirimCommand("/button4", "BUTTON4");
}
    else if(command.includes("jendela pojok kanan atas menyala") || command.includes("jendela 1 naik")){
        setButton1();
    }
    else if(command.includes("jendela pojok kanan atas mati") || command.includes("jendela 1 turun")){
        setButton2();
    }

    else if(command.includes("jendela pojok kiri atas menyala") || command.includes("jendela 2 naik")){
        setButton3();
    }
    else if(command.includes("jendela pojok kiri atas mati") || command.includes("jendela 2 turun")){
        setButton4();
    }

    else if(command.includes("jendela pojok kiri bawah menyala") || command.includes("jendela 3 naik")){
        setButton5();
    }
    else if(command.includes("jendela pojok kiri bawah mati") || command.includes("jendela 3 turun")){
        setButton6();
    }

    else if(command.includes("jendela pojok kanan bawah menyala") || command.includes("jendela 4 naik")){
        setButton7();
    }
    else if(command.includes("jendela pojok kanan bawah mati") || command.includes("jendela 4 turun")){
        setButton8();
    }

    else if(command.includes("forward") || command.includes("for ward") || command.includes("selanjutnya")){
        kirimCommand("/radioforward", "RADIO_FORWARD");
    }
    else if(command.includes("next song") || command.includes("next") || command.includes("lagu selanjutnya")){
        kirimCommand("/radionext", "RADIO_FORWARD");
    }
    else if(command.includes("back") || command.includes("bek") || command.includes("kembali") || command.includes("bak")){
        kirimCommand("/radioback", "RADIO_BACK");
    }
    else if(command.includes("prev song") || command.includes("previous") || command.includes("lagu sebelumnya")){
        kirimCommand("/radioprev", "RADIO_BACK");
    }
    else if(command.includes("source") || command.includes("sumber")){
        kirimCommand("/radiosource", "RADIO_SOURCE");
    }
    else if(command.includes("select") || command.includes("pilih")){
        kirimCommand("/radioselect", "RADIO_SELECT");
    }
    else if(command.includes("vol down") || command.includes("volume down") || command.includes("volume turun")){
        kirimCommand("/radiovoldown", "RADIO_BACK");
    }
    else if(command.includes("vol up") || command.includes("volume up") || command.includes("volume naik")){
        kirimCommand("/radiovolup", "RADIO_FORWARD");
    }
    else if(command.includes("mati") || command.includes("matikan") || command.includes("non aktif")){
    kirimCommand("/button4", "BUTTON4");
    } else if(command.includes("mati") || command.includes("matikan") || command.includes("non aktif")){
    kirimCommand("/button2", "BUTTON2");
    }else if(command.includes("mati") || command.includes("matikan") || command.includes("non aktif")){
    kirimCommand("/button6", "BUTTON6");
    }
    else if(command.includes("mati") || command.includes("matikan") || command.includes("non aktif")){
    kirimCommand("/button8", "BUTTON8");
    }
    else if(command.includes("mati") || command.includes("matikan") || command.includes("non aktif")){
    setButton2();
    }else if(command.includes("mati") || command.includes("matikan") || command.includes("non aktif")){
    setButton4();
    }else if(command.includes("mati") || command.includes("matikan") || command.includes("non aktif")){
    setButton6();
    }else if(command.includes("mati") || command.includes("matikan") || command.includes("non aktif")){
    setButton8();
    }
    else{
        voiceText.innerText = "Perintah tidak dikenal: " + command;
        kirimVoiceStatus("PERINTAH TIDAK DIKENAL: " + command);
    }
    
}
/* =========================
   WINDOW CONTROL - PAKAI LOGIKA ON/OFF ESP32
========================= */

function kontrolButton(namaButton, namaJendela){
    fetch(endpoint + "/" + namaButton, {
        method: "POST"
    })
    .then(response => response.text())
    .then(result => {
        console.log(namaJendela + " : " + result);
    })
    .catch(error => {
        console.log("ESP32 ERROR:", error);
    });
}

function setButton1(){
    kontrolButton("button1", "Jendela pojok kanan atas");
}

function setButton2(){
    kontrolButton("button2", "Jendela pojok kanan atas");
}

function setButton3(){
    kontrolButton("button3", "Jendela pojok kiri atas");
}

function setButton4(){
    kontrolButton("button4", "Jendela pojok kiri atas");
}

function setButton5(){
    kontrolButton("button5", "Jendela pojok kiri bawah");
}

function setButton6(){
    kontrolButton("button6", "Jendela pojok kiri bawah");
}

function setButton7(){
    kontrolButton("button7", "Jendela pojok kanan bawah");
}

function setButton8(){
    kontrolButton("button8", "Jendela pojok kanan bawah");
}
/* =========================
   RADIO CONTROL SESUAI HTML
========================= */

function back(){
    kontrolButton("radioback", "Radio back");
}

function forward(){
    kontrolButton("radioforward", "Radio forward");
}

function source(){
    kontrolButton("radiosource", "Radio source");
}

function select(){
    kontrolButton("radioselect", "Radio select");
}

function prev_song(){
    kontrolButton("radioprev", "Radio prev song");
}

function next_song(){
    kontrolButton("radionext", "Radio next song");
}

function vol_down(){
    kontrolButton("radiovoldown", "Radio volume down");
}

function vol_up(){
    kontrolButton("radiovolup", "Radio volume up");
}

/* =========================
   FIX WINDOW CONTROL TANPA UBAH CSS
========================= */

function aktifkanWindowButton(selector, fungsi){
    const area = document.querySelector(selector);

    if(area){
        area.onclick = function(e){
            e.preventDefault();
            e.stopPropagation();
            fungsi();
        };

        area.ontouchstart = function(e){
            e.preventDefault();
            e.stopPropagation();
            fungsi();
        };
    }
}

document.addEventListener("DOMContentLoaded", function(){

    aktifkanWindowButton(".arrow-right-top", setButton1);
    aktifkanWindowButton(".arrow-right-middle", setButton2);

    aktifkanWindowButton(".arrow-left-top", setButton3);
    aktifkanWindowButton(".arrow-left-middle", setButton4);

    aktifkanWindowButton(".arrow-left-bottom-top", setButton5);
    aktifkanWindowButton(".arrow-left-bottom", setButton6);

    aktifkanWindowButton(".arrow-right-bottom-top", setButton7);
    aktifkanWindowButton(".arrow-right-bottom", setButton8);

});

/* =========================
   MODE LOCAL / FIREBASE
========================= */

const CONTROL_MODE =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"
    ? "local"
    : "firebase";

const FIREBASE_COMMAND_URL =
"https://smart-cars-a9536-default-rtdb.asia-southeast1.firebasedatabase.app/smartcar/command.json";

function kirimCommand(pathLocal, commandFirebase){

    if(CONTROL_MODE === "local"){

        fetch(endpoint + pathLocal, {
            method: "POST"
        })
        .then(response => response.text())
        .then(result => console.log("LOCAL:", result))
        .catch(error => console.log("LOCAL ERROR:", error));

    } else {

        fetch(FIREBASE_COMMAND_URL, {
            method: "PUT",
            body: JSON.stringify(commandFirebase + "|" + Date.now())
        })
        .then(response => response.json())
        .then(result => console.log("FIREBASE:", commandFirebase))
        .catch(error => console.log("FIREBASE ERROR:", error));
    }
}

/* =========================
   WINDOW CONTROL
========================= */

function setButton1(){ kirimCommand("/button1", "BUTTON1"); }
function setButton2(){ kirimCommand("/button2", "BUTTON2"); }
function setButton3(){ kirimCommand("/button3", "BUTTON3"); }
function setButton4(){ kirimCommand("/button4", "BUTTON4"); }
function setButton5(){ kirimCommand("/button5", "BUTTON5"); }
function setButton6(){ kirimCommand("/button6", "BUTTON6"); }
function setButton7(){ kirimCommand("/button7", "BUTTON7"); }
function setButton8(){ kirimCommand("/button8", "BUTTON8"); }

/* =========================
   RADIO CONTROL
========================= */

function back(){ kirimCommand("/radioback", "RADIO_BACK"); }
function forward(){ kirimCommand("/radioforward", "RADIO_FORWARD"); }
function source(){ kirimCommand("/radiosource", "RADIO_SOURCE"); }
function select(){ kirimCommand("/radioselect", "RADIO_SELECT"); }
function prev_song(){ kirimCommand("/radioprev", "RADIO_BACK"); }
function next_song(){ kirimCommand("/radionext", "RADIO_FORWARD"); }
function vol_down(){ kirimCommand("/radiovoldown", "RADIO_BACK"); }
function vol_up(){ kirimCommand("/radiovolup", "RADIO_FORWARD"); }

/* =========================
   FIX WINDOW CONTROL TANPA UBAH CSS
========================= */

function aktifkanWindowButton(selector, fungsi){
    const area = document.querySelector(selector);

    if(area){
        area.onclick = function(e){
            e.preventDefault();
            e.stopPropagation();
            fungsi();
        };

        area.ontouchstart = function(e){
            e.preventDefault();
            e.stopPropagation();
            fungsi();
        };
    }
}

document.addEventListener("DOMContentLoaded", function(){

    aktifkanWindowButton(".arrow-right-top", setButton1);
    aktifkanWindowButton(".arrow-right-middle", setButton2);

    aktifkanWindowButton(".arrow-left-top", setButton3);
    aktifkanWindowButton(".arrow-left-middle", setButton4);

    aktifkanWindowButton(".arrow-left-bottom-top", setButton5);
    aktifkanWindowButton(".arrow-left-bottom", setButton6);

    aktifkanWindowButton(".arrow-right-bottom-top", setButton7);
    aktifkanWindowButton(".arrow-right-bottom", setButton8);
});

function kirimVoiceStatus(status){
    fetch("https://smart-cars-a9536-default-rtdb.asia-southeast1.firebasedatabase.app/smartcar/voiceStatus.json", {
        method: "PUT",
        body: JSON.stringify(status)
    });
}

recognition.onstart = function () {
    isRecording = true;
    micBtn.classList.add("recording");
    voiceText.innerText = "Mendengarkan perintah...";
    kirimVoiceStatus("VOICE AKTIF");
};

recognition.onresult = function (event) {
    const command = event.results[0][0].transcript.toLowerCase();
    voiceText.innerText = "Perintah: " + command;

    kirimVoiceStatus("TERDETEKSI: " + command);
    prosesPerintah(command);
};

recognition.onerror = function (event) {
    voiceText.innerText = "Error voice: " + event.error;
    kirimVoiceStatus("ERROR: " + event.error);
    stopMic();
};

recognition.onend = function () {
    kirimVoiceStatus("VOICE SELESAI");
    stopMic();
};

function resetSaatPindahHalaman(){

    if(CONTROL_MODE === "local"){
        fetch(endpoint + "/reset-all", {
            method: "POST",
            keepalive: true
        });
    } else {
        fetch(FIREBASE_COMMAND_URL, {
            method: "PUT",
            body: JSON.stringify("RESET_ALL|" + Date.now()),
            keepalive: true
        });
    }
}

function kirimResetAll(){
    if(CONTROL_MODE === "local"){
        return fetch(endpoint + "/reset-all", {
            method: "POST"
        });
    } else {
        return fetch(FIREBASE_COMMAND_URL, {
            method: "PUT",
            body: JSON.stringify("RESET_ALL|" + Date.now())
        });
    }
}

document.addEventListener("DOMContentLoaded", function(){

    const menuLinks = document.querySelectorAll(".bottombar a");

    menuLinks.forEach(function(link){

        link.addEventListener("click", function(e){

            e.preventDefault();

            const tujuan = link.href;

            kirimResetAll()
            .finally(function(){
                setTimeout(function(){
                    window.location.href = tujuan;
                }, 300);
            });

        });

    });

});

function resetSekali(){
    if(CONTROL_MODE === "local"){
        return fetch(endpoint + "/reset-all", {
            method: "POST"
        });
    } else {
        return fetch(FIREBASE_COMMAND_URL, {
            method: "PUT",
            body: JSON.stringify("RESET_ALL|" + Date.now())
        });
    }
}

function resetSekali(){
    if(CONTROL_MODE === "local"){
        return fetch(endpoint + "/reset-all", {
            method: "POST"
        });
    } else {
        return fetch(FIREBASE_COMMAND_URL, {
            method: "PUT",
            body: JSON.stringify("RESET_ALL|" + Date.now())
        });
    }
}

function resetLoop(jumlah = 5, jeda = 200){
    let hitung = 0;

    const timer = setInterval(function(){

        resetSekali();
        console.log("RESET KE-" + (hitung + 1));

        hitung++;

        if(hitung >= jumlah){
            clearInterval(timer);
        }

    }, jeda);
}

document.addEventListener("DOMContentLoaded", function(){

    document.querySelectorAll(".bottombar a").forEach(function(link){

        link.addEventListener("click", function(e){

            const tujuan = link.href;

            if(!tujuan || tujuan === "#") return;

            e.preventDefault();

            resetLoop(5, 200);

            setTimeout(function(){
                window.location.href = tujuan;
            }, 1200);
        });
    });
});

let resetTimer = null;

function mulaiResetLoop(){

    if(resetTimer) return;

    resetTimer = setInterval(function(){

        if(CONTROL_MODE === "local"){

            fetch(endpoint + "/reset-all", {
                method: "POST"
            });

        } else {

            fetch(FIREBASE_COMMAND_URL, {
                method: "PUT",
                body: JSON.stringify("RESET_ALL|" + Date.now())
            });

        }

        console.log("RESET LOOP");

    }, 100);

}

function berhentiResetLoop(){

    if(resetTimer){
        clearInterval(resetTimer);
        resetTimer = null;
    }
}

document.addEventListener("DOMContentLoaded", function(){

    document.querySelectorAll(".bottombar a").forEach(function(link){

        let tujuan = "";

        link.addEventListener("mousedown", function(e){

            e.preventDefault();

            tujuan = link.href;

            mulaiResetLoop();
        });

        link.addEventListener("mouseup", function(){

            berhentiResetLoop();

            if(tujuan){
                window.location.href = tujuan;
            }
        });

        link.addEventListener("mouseleave", function(){
            berhentiResetLoop();
        });

        link.addEventListener("touchstart", function(e){

            e.preventDefault();

            tujuan = link.href;

            mulaiResetLoop();
        });

        link.addEventListener("touchend", function(){

            berhentiResetLoop();

            if(tujuan){
                window.location.href = tujuan;
            }
        });
    });
});

async function goPage(page) {
    try {
        const res = await fetch(endpoint + "/reset-all", {
            method: "POST",
            mode: "cors",
            cache: "no-store"
        });

        const text = await res.text();
        console.log("RESET ESP32:", text);

    } catch (e) {
        console.log("RESET GAGAL:", e);
        alert(
            "Reset ESP32 gagal.\n" +
            "Kalau web dibuka dari GitHub HTTPS, browser bisa memblokir akses ke HTTP ESP32.\n\n" +
            "Gunakan localhost, atau buka web dari server HTTP lokal, atau host halaman langsung di ESP32."
        );
    }

    setTimeout(() => {
        window.location.href = page;
    }, 300);
}
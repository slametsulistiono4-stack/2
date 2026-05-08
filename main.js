function setLampRight() {
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
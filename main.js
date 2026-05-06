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
    const rpm = randomRange(700, 6000);
    const speed = randomRange(0, 180);
    const iat = randomRange(10, 50);
    const maf = randomRange(2, 30);

    // 🔥 fuel realistis (0 - 8 bar)
    const fuel = randomRange(0, 101);

    const led = randomRange(0, 100);

    // tampilkan angka biasa
    document.getElementById("coolant").innerText = coolant;
    document.getElementById("map").innerText = map;
    document.getElementById("rpm").innerText = rpm;
    document.getElementById("speed").innerText = speed;
    document.getElementById("iat").innerText = iat;
    document.getElementById("maf").innerText = maf;
    document.getElementById("led").innerText = led;

    // 🔥 fuel pakai persen (max 100%)
    const fuelPercent = Math.min((fuel / 10) * 100, 100);

    document.getElementById("fuel").innerText = fuel.toFixed(0);
    document.getElementById("fuelBar").style.width = fuelPercent + "%";
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

setInterval(updateData, 1000);

const dbUrl = "https://smart-cars-a9536-default-rtdb.asia-southeast1.firebasedatabase.app/";

function controlWindow(pos, action) {
  fetch(dbUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      pos: pos,
      action: action
    })
  });
}


// ubah ke persen (bulat, tanpa desimal)
const fuelPercent = Math.min(Math.floor((fuel / 10) * 100), 100);

// tampilkan angka saja
document.getElementById("fuel").innerText = fuelPercent;

// update bar
document.getElementById("fuelBar").style.width = fuelPercent + "%";
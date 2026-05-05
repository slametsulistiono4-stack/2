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
    document.getElementById("coolant").innerText = Math.floor(Math.random() * 100);
    document.getElementById("map").innerText = Math.floor(Math.random() * 120);
    document.getElementById("rpm").innerText = Math.floor(Math.random() * 3000);
    document.getElementById("speed").innerText = Math.floor(Math.random() * 120);
    document.getElementById("iat").innerText = Math.floor(Math.random() * 50);
    document.getElementById("maf").innerText = Math.floor(Math.random() * 20);
    document.getElementById("fuel").innerText = Math.floor(Math.random() * 300);
    document.getElementById("led").innerText = Math.floor(Math.random() * 255);
}

// update tiap 1 detik
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
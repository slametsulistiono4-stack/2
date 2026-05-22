#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "TEKNOLAB Office";
const char* password = "selamatdatang";

// Ganti jika URL Firebase kamu berbeda
String firebaseCommandURL = "https://smart-cars-a9536-default-rtdb.asia-southeast1.firebasedatabase.app/smartcar/command.json";

bool LampRightState = false;
bool LampLeftState = false;

bool WindowRightFrontState = false;
bool WindowLeftFrontState = false;
bool WindowLeftRearState = false;
bool WindowRightRearState = false;

const int lampright = 4;
const int lampleft = 5;

String lastCommand = "";

void setup() {
  Serial.begin(115200);

  pinMode(lampright, OUTPUT);
  pinMode(lampleft, OUTPUT);

  digitalWrite(lampright, LOW);
  digitalWrite(lampleft, LOW);

  WiFi.begin(ssid, password);

  Serial.println("Menghubungkan ke WiFi...");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("ESP32 TERHUBUNG KE WIFI");
  Serial.print("IP ESP32: ");
  Serial.println(WiFi.localIP());

  Serial.println("ESP32 siap membaca perintah dari Firebase");
}

void loop() {
  bacaFirebase();
  delay(500);
}

void bacaFirebase() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi terputus");
    return;
  }

  HTTPClient http;
  http.begin(firebaseCommandURL);

  int httpCode = http.GET();

  if (httpCode > 0) {
    String command = http.getString();

    command.replace("\"", "");
    command.trim();

    if (command != "" && command != "null" && command != "NONE") {
      prosesCommand(command);
      resetCommandFirebase();
    }
  } else {
    Serial.print("Gagal membaca Firebase. HTTP Code: ");
    Serial.println(httpCode);
  }

  http.end();
}

void resetCommandFirebase() {
  HTTPClient http;
  http.begin(firebaseCommandURL);
  http.addHeader("Content-Type", "application/json");
  http.PUT("\"NONE\"");
  http.end();
}

void prosesCommand(String command) {
  Serial.print("Perintah diterima: ");
  Serial.println(command);

  if (command == "LAMP_RIGHT_TOGGLE") {
    LampRightState = !LampRightState;
    digitalWrite(lampright, LampRightState ? HIGH : LOW);

    if (LampRightState) {
      Serial.println("Lampu kanan menyala");
    } else {
      Serial.println("Lampu kanan mati");
    }
  }

  else if (command == "LAMP_LEFT_TOGGLE") {
    LampLeftState = !LampLeftState;
    digitalWrite(lampleft, LampLeftState ? HIGH : LOW);

    if (LampLeftState) {
      Serial.println("Lampu kiri menyala");
    } else {
      Serial.println("Lampu kiri mati");
    }
  }

  else if (command == "WINDOW_RIGHT_FRONT_ON") {
    WindowRightFrontState = true;
    Serial.println("Jendela kanan depan aktif");
  }

  else if (command == "WINDOW_RIGHT_FRONT_OFF") {
    WindowRightFrontState = false;
    Serial.println("Jendela kanan depan nonaktif");
  }

  else if (command == "WINDOW_LEFT_FRONT_ON") {
    WindowLeftFrontState = true;
    Serial.println("Jendela kiri depan aktif");
  }

  else if (command == "WINDOW_LEFT_FRONT_OFF") {
    WindowLeftFrontState = false;
    Serial.println("Jendela kiri depan nonaktif");
  }

  else if (command == "WINDOW_LEFT_REAR_ON") {
    WindowLeftRearState = true;
    Serial.println("Jendela kiri belakang aktif");
  }

  else if (command == "WINDOW_LEFT_REAR_OFF") {
    WindowLeftRearState = false;
    Serial.println("Jendela kiri belakang nonaktif");
  }

  else if (command == "WINDOW_RIGHT_REAR_ON") {
    WindowRightRearState = true;
    Serial.println("Jendela kanan belakang aktif");
  }

  else if (command == "WINDOW_RIGHT_REAR_OFF") {
    WindowRightRearState = false;
    Serial.println("Jendela kanan belakang nonaktif");
  }

  else {
    Serial.print("Perintah tidak dikenal: ");
    Serial.println(command);
  }
}

#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "TEKNOLAB Office";
const char* password = "selamatdatang";

WebServer server(80);

bool LampRightState = false;
bool LampLeftState = false;
bool Button1State = false;
bool Button2State = false;
bool Button3State = false;
bool Button4State = false;
bool Button5State = false;
bool Button6State = false;
bool Button7State = false;
bool Button8State = false;

const int lampright = 4;
const int lampleft = 5;

void setup() {

  Serial.begin(115200);

  WiFi.begin(ssid, password);

  Serial.println("Menghubungkan ke WiFi...");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("ESP32 TERHUBUNG");

  Serial.print("IP ESP32: ");
  Serial.println(WiFi.localIP());

  server.on("/lampleft", HTTP_POST, setLampLeft);
  server.on("/lampright", HTTP_POST, setLampRight);
  server.on("/button1", HTTP_ANY, setButton1);
  server.on("/button2", HTTP_ANY, setButton2);
  server.on("/button3", HTTP_ANY, setButton3);
  server.on("/button4", HTTP_ANY, setButton4);
  server.on("/button5", HTTP_ANY, setButton5);
  server.on("/button6", HTTP_ANY, setButton6);
  server.on("/button7", HTTP_ANY, setButton7);
  server.on("/button8", HTTP_ANY, setButton8);

  server.begin();

  Serial.println("Server ESP32 siap menerima perintah");

  pinMode(lampright, OUTPUT);
  pinMode(lampleft, OUTPUT);

  digitalWrite(lampright, LOW);
  digitalWrite(lampleft, LOW);
}

void loop() {
  server.handleClient();
}

void setLampRight() {

  LampRightState = !LampRightState;

  digitalWrite(lampright, LampRightState ? HIGH : LOW);

  server.sendHeader("Access-Control-Allow-Origin", "*");

  server.send(200, "text/plain", LampRightState ? "ON" : "OFF");

  if (LampRightState) {

    Serial.println("Lampu kanan menyala");

  } else {

    Serial.println("Lampu kanan mati");
  }
}

void setLampLeft() {
  LampLeftState = !LampLeftState;
  digitalWrite(lampleft, LampLeftState ? HIGH : LOW);
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", LampLeftState ? "ON" : "OFF");
  if (LampLeftState) {
    Serial.println("Lampu kiri menyala");
  } else {
    Serial.println("Lampu kiri mati");
  }
}

void setButton1() {

  Button1State = true;
  Button2State = false;

  server.sendHeader("Access-Control-Allow-Origin", "*");

  server.send(200, "text/plain", "ON");

  Serial.println("Jendela kanan depan aktif");
}

void setButton2() {

  Button1State = false;
  Button2State = true;

  server.sendHeader("Access-Control-Allow-Origin", "*");

  server.send(200, "text/plain", "OFF");

  Serial.println("Jendela kanan depan nonaktif");
}

void setButton3() {

  Button3State = true;
  Button4State = false;

  server.sendHeader("Access-Control-Allow-Origin", "*");

  server.send(200, "text/plain", "ON");

  Serial.println("Jendela kiri depan aktif");
}

void setButton4() {

  Button3State = false;
  Button4State = true;

  server.sendHeader("Access-Control-Allow-Origin", "*");

  server.send(200, "text/plain", "OFF");

  Serial.println("Jendela kiri depan nonaktif");
}

void setButton5() {

  Button5State = true;
  Button6State = false;

  server.sendHeader("Access-Control-Allow-Origin", "*");

  server.send(200, "text/plain", "ON");

  Serial.println("Jendela kiri belakang aktif");
}

void setButton6() {

  Button5State = false;
  Button6State = true;

  server.sendHeader("Access-Control-Allow-Origin", "*");

  server.send(200, "text/plain", "OFF");

  Serial.println("Jendela kiri belakang nonaktif");
}

void setButton7() {

  Button7State = true;
  Button8State = false;

  server.sendHeader("Access-Control-Allow-Origin", "*");

  server.send(200, "text/plain", "ON");

  Serial.println("Jendela kanan belakang aktif");
}

void setButton8() {

  Button7State = false;
  Button8State = true;

  server.sendHeader("Access-Control-Allow-Origin", "*");

  server.send(200, "text/plain", "OFF");

  Serial.println("Jendela kanan belakang nonaktif");
}
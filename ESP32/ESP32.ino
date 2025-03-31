#include <WiFi.h>
#include <WebSocketsServer.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 5
#define RST_PIN 22
#define LED_PIN 2

const char* apSSID = "ESP32_HOTSPOT";
const char* apPassword = "12345678";

WebSocketsServer webSocket(81);
MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
    Serial.begin(115200);
    Serial.println("ESP32 RFID Reader Starting...");
    SPI.begin();
    rfid.PCD_Init();

    // LED Setup
    pinMode(LED_PIN, OUTPUT);
    digitalWrite(LED_PIN, LOW);

    // Start ESP32 as Access Point
    WiFi.softAP(apSSID, apPassword);
    Serial.println("Hotspot Started!");
    Serial.print("ESP32 IP: ");
    Serial.println(WiFi.softAPIP());

    // Start WebSocket Server
    webSocket.begin();
    webSocket.onEvent(webSocketEvent);
}

void loop() {
    webSocket.loop();

    // Early return if no new RFID card is present
    if (!rfid.PICC_IsNewCardPresent()) return;
    if (!rfid.PICC_ReadCardSerial()) return;

    String cardUID = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
        cardUID += String(rfid.uid.uidByte[i], HEX);
        if (i < rfid.uid.size - 1) cardUID += ":";
    }

    Serial.println("Sending UID: " + cardUID);
    webSocket.broadcastTXT(cardUID);

    // LED Confirmation
    digitalWrite(LED_PIN, HIGH); 
    delay(500);
    digitalWrite(LED_PIN, LOW);
    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
    if (type == WStype_TEXT) {
        Serial.printf("Received from client: %s\n", payload);
    }
}

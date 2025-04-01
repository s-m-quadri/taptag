#include <WiFi.h>
#include <WebSocketsServer.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 5
#define RST_PIN 22

const char* apSSID = "ESP32_HOTSPOT";
const char* apPassword = "12345678";

WebSocketsServer webSocket(81);
MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
    Serial.begin(115200);
    Serial.println("[ESP32] Starting...");
    SPI.begin();
    rfid.PCD_Init();
    Serial.print("[ESP32] RFID Version: ");
    Serial.println(rfid.PCD_ReadRegister(MFRC522::VersionReg), HEX);

    // Start ESP32 as Access Point
    WiFi.softAP(apSSID, apPassword);
    Serial.print("[Hotspot] ESP32 IP: ");
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

    Serial.println("[WebSocket] Sending UID: " + cardUID);
    webSocket.broadcastTXT(cardUID);

    rfid.PICC_HaltA();
    rfid.PCD_StopCrypto1();
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
    if (type == WStype_TEXT) {
        Serial.printf("[WebSocket] Received from client: %s\n", payload);
    }
}
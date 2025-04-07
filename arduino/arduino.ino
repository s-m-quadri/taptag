#include <WiFi.h>
#include <WebSocketsServer.h>
#include <SPI.h>
#include <MFRC522.h>
#include <AESLib.h>
#include <Base64.h>
#include <ArduinoJson.h>

#define SS_PIN 5
#define RST_PIN 22

const char* SECRET_KEY_BASE64 = "Rw4ct/4Yf/XdyEnKdQI/pAS5hD0y/Sjj5jU/8p+3oFI=";
const char* apSSID = "RFID-5UEV1KSG4TW";
const char* apPassword = "16e9a172-c7ba-4ec4-94bd-3a9caf63e99d";

WebSocketsServer webSocket(81);
MFRC522 rfid(SS_PIN, RST_PIN);
AESLib aesLib;

byte aesKey[32];

void decodeSecretKey() {
  char decodedKey[33];
  int keyLen = base64_decode(decodedKey, SECRET_KEY_BASE64, strlen(SECRET_KEY_BASE64));
  if (keyLen != 32) {
    Serial.printf("[AES] Unexpected key length: %d\n", keyLen);
  }
  memcpy(aesKey, decodedKey, 32);
  Serial.print("[ESP32] AES Key (hex): ");
  for (int i = 0; i < 32; i++) {
    Serial.printf("%02X", aesKey[i]);
    if (i < 31) Serial.print(" ");
  }
  Serial.println();
  Serial.printf("[AES] Decoded secret key, length = %d bytes\n", keyLen);
}


void setup() {
  Serial.begin(115200);
  Serial.println("[ESP32] Starting...");

  decodeSecretKey();

  SPI.begin(18, 19, 23, 5);  // SCK, MISO, MOSI, SS
  randomSeed(esp_random());
  delay(100);
  rfid.PCD_Init();
  delay(100);
  Serial.print("[ESP32] RFID Version: ");
  Serial.println(rfid.PCD_ReadRegister(MFRC522::VersionReg), HEX);

  WiFi.softAP(apSSID, apPassword);
  Serial.print("[Hotspot] ESP32 IP: ");
  Serial.println(WiFi.softAPIP());

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();

  if (!rfid.PICC_IsNewCardPresent()) return;
  if (!rfid.PICC_ReadCardSerial()) return;

  String cardUID = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    cardUID += String(rfid.uid.uidByte[i], HEX);
  }
  cardUID.toUpperCase();
  Serial.println("[RFID] Tag Detected: " + cardUID);

  String encryptedUID = encrypt(cardUID);
  Serial.println("[RFID] Encrypted UID: " + encryptedUID);
  webSocket.broadcastTXT(encryptedUID);

  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();
}

String encrypt(String plainText) {
  int inputLength = plainText.length();
  int cipherLength = aesLib.get_cipher64_length(inputLength);
  char encrypted[cipherLength];

  byte iv[16] = { 0 };

  aesLib.encrypt64((byte*)plainText.c_str(), inputLength, encrypted, aesKey, 256, iv);
  return String(encrypted);
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t* payload, size_t length) {
  if (type == WStype_TEXT) {
    Serial.printf("[WebSocket] Received from client: %s\n", payload);
  }
}
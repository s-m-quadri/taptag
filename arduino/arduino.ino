#include <WiFi.h>
#include <WebSocketsServer.h>
#include <SPI.h>
#include <MFRC522.h>
#include <AESLib.h>
#include <Base64.h>

#define SS_PIN 5
#define RST_PIN 22

// 32-byte key base64-encoded (for backend compatibility)
const char* SECRET_KEY_BASE64 = "MDFlNTU3ZmEtODgxZS00MTBiLTg2ODAtNmI1YTYyNTg3ZGYz"; // = "01e557fa-881e-410b-8680-6b5a62587df3"
const char* apSSID = "RFID-Z4H8I2BPMPP";
const char* apPassword = "7295aadb-2f76-495d-8792-2590cbd327e7";

WebSocketsServer webSocket(81);
MFRC522 rfid(SS_PIN, RST_PIN);
AESLib aesLib;

byte aesKey[32];

void decodeSecretKey() {
  char decodedKey[32]; // should match expected decoded size (32 bytes for AES-256)
  int keyLen = base64_decode(decodedKey, SECRET_KEY_BASE64, strlen(SECRET_KEY_BASE64));
  memcpy(aesKey, "01e557fa-881e-410b-8680-6b5a62587df3", keyLen);
  Serial.printf("[AES] Decoded secret key, length = %d bytes\n", keyLen);
}

void setup() {
  Serial.begin(115200);
  Serial.println("[ESP32] Starting...");

  decodeSecretKey();

  SPI.begin(18, 19, 23, 5); // SCK, MISO, MOSI, SS
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

  aesLib.encrypt64((byte*)plainText.c_str(), inputLength, encrypted, aesKey, 256);
  return String(encrypted);
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  if (type == WStype_TEXT) {
    Serial.printf("[WebSocket] Received from client: %s\n", payload);
  }
}

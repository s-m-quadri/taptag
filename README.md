![thumbnail](https://github.com/user-attachments/assets/5d814ab5-5c61-4122-9943-840d211c3417)

<div align="center">
   <h1>🪪 TapTag</h1>
   <p>TapTag is a smart attendance system that uses RFID technology to track attendance efficiently.</p>
  <p><a href="https://github.com/s-m-quadri/taptag/issues/new?assignees=&labels=bug&projects=&template=bug_report.yml">Report Bugs</a> · <a href="https://github.com/s-m-quadri/taptag/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.yml">Request Feature</a> · <a href="https://github.com/s-m-quadri/taptag/discussions/new?category=q-a">Ask Question</a> · <a href="https://github.com/Safouene1/support-palestine-banner/blob/master/Markdown-pages/Support.md">Support 🇵🇸 Palestine</a></p>
  <a href="https://github.com/s-m-quadri/taptag/releases"><img src="https://custom-icon-badges.demolab.com/github/v/tag/s-m-quadri/taptag?label=Version&labelColor=302d41&color=f2cdcd&logoColor=d9e0ee&logo=tag&style=for-the-badge" alt="GitHub Readme Profile Version"/></a>
  <a href="https://www.codefactor.io/repository/github/s-m-quadri/taptag"><img src="https://img.shields.io/codefactor/grade/github/s-m-quadri/taptag?label=CodeFactor&labelColor=302d41&color=8bd5ca&logoColor=d9e0ee&logo=codefactor&style=for-the-badge" alt="GitHub Readme Profile Code Quality"/></a>
  <a href="https://github.com/s-m-quadri/taptag/issues"><img src="https://custom-icon-badges.demolab.com/github/issues/s-m-quadri/taptag?label=Issues&labelColor=302d41&color=f5a97f&logoColor=d9e0ee&logo=issue&style=for-the-badge" alt="GitHub Readme Profile Issues"/></a>
  <a href="https://github.com/s-m-quadri/taptag/pull"><img src="https://custom-icon-badges.demolab.com/github/issues-pr/s-m-quadri/taptag?&label=Pull%20requests&labelColor=302d41&color=ddb6f2&logoColor=d9e0ee&logo=git-pull-request&style=for-the-badge" alt="GitHub Readme Profile PRs"/></a>
  <a href="https://github.com/s-m-quadri/taptag/graphs/contributors"><img src="https://custom-icon-badges.demolab.com/github/contributors/s-m-quadri/taptag?label=Contributors&labelColor=302d41&color=c9cbff&logoColor=d9e0ee&logo=people&style=for-the-badge"/></a>
</div>

## 📌 Features
- **RFID-Based Authentication:** Uses RFID cards/tags to register attendance.
- **ESP32 + RFID:** Reads RFID tags and sends data wirelessly.
- **Wi-Fi Communication:** Runs as a Wi-Fi hotspot to communicate with the Flutter app.
- **WebSockets Integration:** Provides real-time updates.
- **Flutter App:** Displays attendance logs and statistics.
- **Express Backend:** Manages user data, attendance logs, and authentication using TypeScript and Mongoose.

## 📌 Project Structure
This repository contains three main folders:
- **`arduino`** - Contains the `.ino` file for ESP32 firmware.
- **`flutter`** - Contains the Flutter application for Web, Windows, and Android (in development).
- **`express`** - Contains the backend source code using TypeScript, Mongoose, and Express.js.

## 📌 Documentation
Postman API Documentation: [**TapTag Postman Collection**](https://www.postman.com/s-m-quadri/taptag)


## 📌 Requirements

### Hardware
- **ESP32 Development Board**
- **RFID RC522 Module**
- **RFID Cards/Tags**
- **5V Power Supply**
- **Wires & PCB (Optional)**

### Software
- **Arduino IDE** (with ESP32 board support)
- **Flutter SDK** (for app development)
- **Node.js & npm** (for backend development)
- **MongoDB** (for data storage)
- **Postman** (for API testing)

## 📌 Wiring Diagram
Here is the wiring sequence for the RFID RC522 sensor (including **IRQ**, though it's not typically used in SPI mode):  

| **RFID RC522 Pin** | **ESP32 Pin**   |
| ------------------ | --------------- |
| **SDA (SS)**       | 5               |
| **SCK**            | 18              |
| **MOSI**           | 23              |
| **MISO**           | 19              |
| **IRQ**            | (Not connected) |
| **GND**            | GND             |
| **RST**            | 22              |
| **3.3V**           | 3.3V            |

## 📌 Setup & Installation
### ESP32 Setup
1. Install Arduino IDE and add **ESP32 board support**.
2. Install the required libraries listed above.
3. Upload the ESP32 firmware from the `arduino` folder using Arduino IDE.
4. Connect ESP32 to Wi-Fi or run in Hotspot Mode.

### Backend Setup
1. Navigate to the `express` folder:
   ```sh
   cd express
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up your `.env` file with MongoDB URI and other configs.
4. Start the server:
   ```sh
   npm run dev
   ```

### Flutter App Setup
1. Navigate to the `flutter` folder:
   ```sh
   cd flutter
   ```
2. Install dependencies:
   ```sh
   flutter pub get
   ```
3. Run the app:
   ```sh
   flutter run
   ```

## 📌 Contributing
Feel free to fork this repository, improve it, and submit pull requests.

## 📌 License
This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**. Commercial use is prohibited, and all modifications must remain open-source.

## 📌 Contact
For questions, reach out at **dev.smq@gmail.com**

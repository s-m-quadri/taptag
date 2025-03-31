# TapTag - RFID-Based Attendance System

TapTag is a smart RFID-based attendance system that uses an ESP32 microcontroller, RFID module, and a Flutter app for real-time attendance tracking over Wi-Fi.

## Features
- RFID-Based Authentication: Uses RFID cards/tags to register attendance.
- ESP32 + RFID: Reads RFID tags and sends data wirelessly.
- Wi-Fi Communication: Runs as a Wi-Fi hotspot to communicate with the Flutter app.
- WebSockets Integration: Provides real-time updates.
- Flutter App: Displays attendance logs and statistics.

---
## Hardware Requirements
- ESP32 Development Board
- RFID RC522 Module
- RFID Cards/Tags
- 5V Power Supply
- Wires & PCB (Optional)

---
## Software Requirements
- TODO: List required software and libraries

---
## Wiring Diagram
| RFID RC522 Pin | ESP32 Pin |
| -------------- | --------- |
| SDA            | 5 (SS)    |
| RST            | 22 (RST)  |
| MOSI           | 23 (MOSI) |
| MISO           | 19 (MISO) |
| SCK            | 18 (SCK)  |
| GND            | GND       |
| VCC            | 3.3V      |

---
## Setup & Installation
1. Install Arduino IDE and add ESP32 board support.
2. Install Required Libraries:
   - TODO: List necessary libraries
3. Upload the ESP32 Code using Arduino IDE.
4. Connect ESP32 to Wi-Fi or Use Hotspot Mode.
5. Flutter App Setup:
   - TODO: Provide Flutter setup steps
6. Scan RFID Cards and check the app for real-time attendance updates.

---
## Flutter Integration
1. TODO: Describe how to integrate Flutter with ESP32
2. TODO: Explain how to handle WebSocket communication

---
## Contributing
Feel free to fork this repository, improve it, and submit pull requests.

---
## License
This project is licensed under the GNU General Public License v3.0 (GPL-3.0). Commercial use is prohibited, and all modifications must remain open-source.

---
## Contact
For questions, reach out at **dev.smq@gmail.com**


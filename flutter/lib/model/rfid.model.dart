import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:wifi_scan/wifi_scan.dart';
import 'package:wifi_iot/wifi_iot.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

final String baseUrl = 'https://api.taptag.s-m-quadri.me';

class RFIDProvider with ChangeNotifier {
  List<WiFiAccessPoint> rfidNetworks = [];
  WebSocketChannel? _channel;
  List<String> offlineBuffer = [];
  List<String> scannedRFIDs = [];
  bool isListening = false;

  bool isScanning = false;
  bool isConnected = false;
  String? currentSSID;

  Future<void> scanRFIDNetworks() async {
    final locPermission = await Permission.location.request();
    if (!locPermission.isGranted) throw Exception("Location permission required.");

    isScanning = true;
    notifyListeners();

    final canScan = await WiFiScan.instance.canStartScan();
    if (canScan != CanStartScan.yes) throw Exception("Cannot scan: $canScan");

    await WiFiScan.instance.startScan();
    final results = await WiFiScan.instance.getScannedResults();
    rfidNetworks = results.where((ap) => ap.ssid.startsWith("RFID-")).toList();

    isScanning = false;
    notifyListeners();
  }

  Future<String> fetchPasswordForSSID(String ssid, String token) async {
    final response = await http.get(Uri.parse('$baseUrl/reader?ssid=$ssid'), headers: {'Authorization': token});
    print("Reader Response: ${response.body}");
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print("🔑 Password for $ssid: ${data['result'][0]['password']}");
      return data['result'][0]['password'];
    } else {
      throw Exception("Failed to fetch reader info");
    }
  }

  Future<void> connectToRFID(String ssid, String password) async {
    print("🔗 Connecting to $ssid with password: $password");
    final success = await WiFiForIoTPlugin.connect(
      ssid,
      password: password,
      security: NetworkSecurity.WPA,
      joinOnce: true,
      withInternet: false,
    );
    print("Connection success: $success");

    if (!success) throw Exception("Failed to connect to $ssid");

    currentSSID = ssid;
    isConnected = true;
    notifyListeners();

    await connectToWebSocket();
  }

  Future<void> connectToWebSocket() async {
    try {
      _channel = WebSocketChannel.connect(Uri.parse('ws://192.168.4.1:81'));

      _channel!.stream.listen(
        (message) {
          debugPrint("📨 RFID Received: $message");
          scannedRFIDs.add(message);
          notifyListeners();
        },
        onError: (error) {
          isListening = false;
          debugPrint("❌ WebSocket Error: $error");
          notifyListeners();
        },
        onDone: () {
          debugPrint("🔌 WebSocket Disconnected");
        },
      );

      isListening = true;
      notifyListeners();
    } catch (e) {
      debugPrint("💥 WebSocket Connection Error: $e");
    }
  }

  Future<void> cacheLocally(String data) async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> cached = prefs.getStringList('rfid_cache') ?? [];
    cached.add(data);
    await prefs.setStringList('rfid_cache', cached);
  }

  Future<void> syncDataToServer() async {
    final prefs = await SharedPreferences.getInstance();
    final List<String> cached = prefs.getStringList('rfid_cache') ?? [];

    for (var item in cached) {
      await http.post(
        Uri.parse("$baseUrl/sync-rfid"),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'data': item}),
      );
    }

    offlineBuffer.clear();
    await prefs.remove('rfid_cache');
    notifyListeners();
  }

  void disconnectWebSocket() {
    _channel?.sink.close();
    _channel = null;
    isListening = false;
    notifyListeners();
  }
}

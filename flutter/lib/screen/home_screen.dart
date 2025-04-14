import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taptag/model/attendance.model.dart';
import 'package:taptag/model/reader.model.dart';
import 'package:taptag/screen/auth_screen.dart';
import 'package:taptag/model/theme.model.dart';
import 'package:taptag/model/user.model.dart';
import 'package:taptag/screen/details_screen.dart';
import 'package:taptag/screen/rfid_screen.dart';
import 'package:flutter/services.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Future<void> refresh() async {
    final rfidService = Provider.of<RFIDService>(context, listen: false);
    final readerProvider = Provider.of<ReaderProvider>(context, listen: false);
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final attendanceProvider = Provider.of<AttendanceProvider>(context, listen: false);
    await Future.wait([
      rfidService.scanRFIDNetworks(),
      readerProvider.fetchAllReaders(userProvider.token!),
      attendanceProvider.fetchAllAttendance(userProvider.token!),
    ]);
    setState(() {});
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => refresh());
  }

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProvider>(context).user;
    final themeProvider = Provider.of<ThemeProvider>(context, listen: false);
    final readerProvider = Provider.of<ReaderProvider>(context, listen: false);
    final rfidService = Provider.of<RFIDService>(context);
    final reasonController = TextEditingController();
    final attendanceProvider = Provider.of<AttendanceProvider>(context, listen: false);
    bool isOut = true;

    if (user == null) {
      return const Center(child: CircularProgressIndicator());
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Welcome'),
        actions: [
          IconButton(
            icon: const Icon(Icons.brightness_6),
            onPressed: () {
              themeProvider.toggleTheme();
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await Provider.of<UserProvider>(context, listen: false).logout();
              if (!context.mounted) return;
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (_) => const AuthScreen()),
                (route) => false,
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: refresh,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text('Name: ${user.name}'),
            Text('Email: ${user.email}'),
            Text('Mobile: ${user.mobileNo}'),
            Text('Type: ${user.type}'),
            Text('Verified Email: ${user.verifiedEmail}'),
            Text('Verified Mobile: ${user.verifiedMobileNo}'),
            const SizedBox(height: 20),

            if (rfidService.isConnected)
              Text("✅ Connected to: ${rfidService.currentSSID}", style: const TextStyle(color: Colors.green))
            else
              const Text("❌ Not connected to RFID", style: TextStyle(color: Colors.red)),

            if (rfidService.offlineBuffer.isNotEmpty) Text("📦 Offline scans: ${rfidService.offlineBuffer.length}"),

            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () async {
                try {
                  await rfidService.scanRFIDNetworks();
                } catch (e) {
                  if (!context.mounted) return;
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Error: $e")));
                }
              },
              child: const Text("Scan RFID Networks"),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () async {
                if (rfidService.isListening) {
                  rfidService.disconnectWebSocket();
                } else {
                  try {
                    await rfidService.connectToWebSocket();
                  } catch (e) {
                    if (!context.mounted) return;

                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Error: $e")));
                  }
                }
              },
              child: Text(rfidService.isListening ? "Disconnect WebSocket" : "Connect WebSocket"),
            ),
            const SizedBox(height: 20),
            rfidService.rfidNetworks.isEmpty
                ? const Text("No RFID networks found.")
                : ListView.builder(
                  shrinkWrap: true,
                  itemCount: rfidService.rfidNetworks.length,
                  itemBuilder: (context, index) {
                    final net = rfidService.rfidNetworks[index];
                    // Get passwords from readerProvider
                    final reader = readerProvider.allReaders.firstWhere(
                      (reader) => reader.ssid == net.ssid,
                      orElse: () => ReaderModel(ssid: net.ssid),
                    );

                    return reader.password == null
                        ? ListTile(
                          title: Text("${reader.name} (${net.ssid})"),
                          subtitle: Text("No password available (${net.level})"),
                          leading: Icon(Icons.wifi),
                        )
                        : ListTile(
                          title: Text("${reader.name} (${net.ssid})"),
                          subtitle: Text("${reader.description} (${net.level})"),
                          leading: Icon(Icons.wifi),
                          tileColor:
                              rfidService.currentSSID == net.ssid ? Theme.of(context).primaryColor.withAlpha(50) : null,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          onTap: () async {
                            await Clipboard.setData(ClipboardData(text: reader.password!));
                            if (!context.mounted) return;
                            ScaffoldMessenger.of(
                              context,
                            ).showSnackBar(const SnackBar(content: Text("Password copied to clipboard")));
                            rfidService.currentSSID = reader.ssid;
                            setState(() {});
                          },
                          trailing: rfidService.currentSSID == net.ssid ? Icon(Icons.check) : Icon(Icons.copy),
                        );
                  },
                ),
            if (rfidService.isListening) ...[
              TextField(
                controller: reasonController,
                decoration: const InputDecoration(labelText: "Reason (e.g. lecture)"),
              ),
              Row(
                children: [
                  const Text("Is Out?"),
                  Switch(
                    value: isOut,
                    onChanged: (value) {
                      isOut = value;
                      setState(() {});
                    },
                  ),
                ],
              ),
              ElevatedButton(
                onPressed: () async {
                  print("Submitting attendance...");
                  if (rfidService.scannedRFIDs.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("No RFID scans yet.")));
                    return;
                  }
                  if (rfidService.currentSSID == null) {
                    ScaffoldMessenger.of(
                      context,
                    ).showSnackBar(const SnackBar(content: Text("Please connect to a reader first.")));
                    return;
                  }
                  final readerId =
                      readerProvider.allReaders
                          .firstWhere(
                            (reader) => reader.ssid == rfidService.currentSSID,
                            orElse: () => ReaderModel(ssid: rfidService.currentSSID!),
                          )
                          .id;
                  if (readerId == null) {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Reader ID not found.")));
                    return;
                  }
                  final reason = reasonController.text.trim();

                  print("Reason: $reason");
                  print("Is Out: $isOut");
                  print("RFID: ${rfidService.currentSSID}");
                  try {
                    await attendanceProvider.submitAttendance(
                      token: Provider.of<UserProvider>(context, listen: false).token!,
                      reader: readerId,
                      students: rfidService.scannedRFIDs,
                      reason: reason,
                      isOut: isOut,
                    );
                    if (!context.mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Attendance submitted.")));
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Error: $e")));
                  }
                },
                child: const Text("Submit Attendance"),
              ),
              const SizedBox(height: 20),
              rfidService.scannedRFIDs.isEmpty
                  ? const Text("No RFID scans yet.")
                  : ListView.builder(
                    shrinkWrap: true,
                    itemCount: rfidService.scannedRFIDs.length,
                    itemBuilder: (context, index) {
                      return ListTile(
                        title: Text(rfidService.scannedRFIDs[index]),
                        leading: const Icon(Icons.badge_outlined),
                      );
                    },
                  ),
            ],
            const SizedBox(height: 20),
            attendanceProvider.attendanceResults.isEmpty
                ? const Text("No attendance results yet.")
                : ListView.builder(
                  shrinkWrap: true,
                  // Color and border on expansion tile
                  itemBuilder: (context, index) {
                    final result = attendanceProvider.attendanceResults[index];
                    return ListTile(
                      title: Text("Attendance on date ${result.date}"),
                      subtitle: Text(result.reason),
                      leading: const Icon(Icons.check_circle_outline),
                      trailing: const Icon(Icons.arrow_forward),
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => AttendanceDetailPage(attendance: result)),
                        );
                      },
                    );
                  },
                ),
            const SizedBox(height: 200),
          ],
        ),
      ),
    );
  }
}

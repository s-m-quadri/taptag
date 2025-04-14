import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:taptag/model/attendance.model.dart';
import 'package:taptag/model/reader.model.dart';
import 'package:taptag/model/user.model.dart';
import 'package:taptag/model/theme.model.dart';
import 'package:taptag/screen/rfid_screen.dart';

class AttendanceStepperPage extends StatefulWidget {
  const AttendanceStepperPage({super.key});

  @override
  State<AttendanceStepperPage> createState() => _AttendanceStepperPageState();
}

class _AttendanceStepperPageState extends State<AttendanceStepperPage> {
  int currentStep = 0;
  String? selectedSSID;
  final reasonList = ["lecture", "lab", "exam", "seminar", "workshop", "extracurricular", "general"];
  String selectedReason = "general";
  bool isOut = false;
  bool isSubmitting = false;

  Future<void> refresh() async {
    final rfidService = Provider.of<RFIDService>(context, listen: false);
    final readerProvider = Provider.of<ReaderProvider>(context, listen: false);
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    rfidService.scanRFIDNetworks();
    readerProvider.fetchAllReaders(userProvider.token!);
  }

  final reasonController = TextEditingController();

  @override
  void dispose() {
    reasonController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      refresh();
    });
  }

  void resetStepper() {
    final rfidService = Provider.of<RFIDService>(context, listen: false);
    rfidService.scannedRFIDs.clear();
    rfidService.disconnectWebSocket();
    selectedSSID = null;
    currentStep = 0;
    reasonController.clear();
    setState(() {});
  }

  Widget buildStepContent(int step) {
    final rfidService = Provider.of<RFIDService>(context, listen: false);
    final readerProvider = Provider.of<ReaderProvider>(context, listen: false);

    switch (step) {
      case 0:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Instructions",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.primary),
            ),
            const Text(
              "1. Click on a network below to copy its password.\n"
              "2. Go to Wi-Fi settings and connect using the same SSID and password.\n"
              "3. Return and click continue once connected.",
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                ElevatedButton.icon(
                  onPressed: () async {
                    await rfidService.scanRFIDNetworks();
                    setState(() {});
                  },
                  icon: const Icon(Icons.refresh),
                  label: const Text("Rescan Networks"),
                ),
              ],
            ),
            const SizedBox(height: 10),
            if (rfidService.rfidNetworks.isEmpty) const Text("No RFID networks found."),
            ...rfidService.rfidNetworks.map((net) {
              final reader = readerProvider.allReaders.firstWhere(
                (reader) => reader.ssid == net.ssid,
                orElse: () => ReaderModel(ssid: net.ssid),
              );

              return ListTile(
                title: Text("${reader.name ?? 'Unnamed'} (${net.ssid})"),
                subtitle: Text(
                  reader.password != null ? "${reader.description ?? 'No Description'}" : "No password available",
                ),
                tileColor: selectedSSID == net.ssid ? Theme.of(context).primaryColor.withAlpha(40) : null,
                onTap: () async {
                  if (reader.password != null) {
                    await Clipboard.setData(ClipboardData(text: reader.password!));
                    ScaffoldMessenger.of(
                      context,
                    ).showSnackBar(const SnackBar(content: Text("Password copied to clipboard")));
                    setState(() {
                      selectedSSID = reader.ssid;
                    });
                  }
                },
              );
            }),
          ],
        );

      case 1:
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Instructions",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.primary),
            ),
            const Text(
              "1. Disable all mobile data and other Wi-Fi networks.\n"
              "2. Only stay connected to the RFID reader network.\n"
              "3. Wait for real-time scans to appear below.",
            ),
            const SizedBox(height: 10),
            rfidService.isListening
                ? Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "✅ Listening for scans...",
                      style: TextStyle(color: Theme.of(context).colorScheme.primary, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(width: 10),
                    if (rfidService.scannedRFIDs.isNotEmpty)
                      ElevatedButton.icon(
                        onPressed: () {
                          rfidService.scannedRFIDs.clear();
                          setState(() {});
                        },
                        icon: const Icon(Icons.restart_alt),
                        label: const Text("Reset"),
                      ),
                  ],
                )
                : ElevatedButton(
                  onPressed: () async {
                    try {
                      await rfidService.connectToWebSocket();
                      print("✅ Connected to WebSocket");
                    } catch (e) {
                      print("❌ Failed to connect: $e");
                    }
                  },
                  child: Text("Reconnect to WebSocket"),
                ),
            const SizedBox(height: 10),
            ...rfidService.scannedRFIDs.map(
              (rfid) => ListTile(title: Text(rfid), leading: const Icon(Icons.badge_outlined)),
            ),
          ],
        );

      case 2:
        return isSubmitting
            ? const Center(child: CircularProgressIndicator())
            : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Instructions",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ),

                const Text(
                  "1. Disable RFID reader network and connect to the Internet.\n"
                  "2. Click Submit to complete process.",
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  value: selectedReason,
                  onChanged: (val) {
                    if (val != null) {
                      selectedReason = val;
                      setState(() {});
                    }
                  },
                  items:
                      reasonList.map((r) {
                        return DropdownMenuItem(value: r, child: Text(r.toUpperCase()));
                      }).toList(),
                  decoration: const InputDecoration(labelText: "Reason"),
                ),
                const SizedBox(height: 10),
                SwitchListTile(
                  title: const Text("Is this an 'Out' entry?"),
                  subtitle: const Text("Enable if this attendance is for leaving (exit)."),
                  value: isOut,
                  onChanged: (val) {
                    setState(() {
                      isOut = val;
                    });
                  },
                ),

                const SizedBox(height: 20),
              ],
            );

      default:
        return const SizedBox.shrink();
    }
  }

  bool canContinue(int step) {
    final rfidService = Provider.of<RFIDService>(context, listen: false);
    switch (step) {
      case 0:
        return selectedSSID != null;
      case 1:
        return rfidService.scannedRFIDs.isNotEmpty;
      default:
        return true;
    }
  }

  Future<void> handleStepContinue() async {
    final rfidService = Provider.of<RFIDService>(context, listen: false);
    final readerProvider = Provider.of<ReaderProvider>(context, listen: false);
    final attendanceProvider = Provider.of<AttendanceProvider>(context, listen: false);
    final userProvider = Provider.of<UserProvider>(context, listen: false);

    if (currentStep == 1) {
      // Step 1 → 2: disconnect socket before showing submit
      rfidService.disconnectWebSocket();
    }

    if (currentStep == 2) {
      setState(() => isSubmitting = true); // start loader

      final reader = readerProvider.allReaders.firstWhere(
        (reader) => reader.ssid == selectedSSID,
        orElse: () => ReaderModel(ssid: selectedSSID!),
      );

      if (reader.id == null) {
        setState(() => isSubmitting = false);
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Reader ID not found.")));
        return;
      }

      try {
        await attendanceProvider.submitAttendance(
          token: userProvider.token!,
          reader: reader.id!,
          students: rfidService.scannedRFIDs,
          reason: selectedReason,
          isOut: isOut,
        );
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Attendance Submitted.")));
        resetStepper();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Error: $e")));
      } finally {
        setState(() => isSubmitting = false); // stop loader
      }
    } else {
      setState(() {
        currentStep++;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Stepper(
      currentStep: currentStep,
      onStepContinue: canContinue(currentStep) ? handleStepContinue : null,
      onStepCancel:
          currentStep == 0
              ? null
              : () {
                setState(() {
                  currentStep--;
                });
              },
      steps: [
        Step(
          title: const Text("Connect to Network"),
          content: buildStepContent(0),
          isActive: currentStep >= 0,
          state: currentStep > 0 ? StepState.complete : StepState.indexed,
        ),
        Step(
          title: const Text("Scan Students"),
          content: buildStepContent(1),
          isActive: currentStep >= 1,
          state: currentStep > 1 ? StepState.complete : StepState.indexed,
        ),
        Step(
          title: const Text("Submit Attendance"),
          content: buildStepContent(2),
          isActive: currentStep >= 2,
          state: currentStep == 2 ? StepState.editing : StepState.indexed,
        ),
      ],
    );
  }
}

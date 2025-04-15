import 'package:flutter/material.dart';

class PrivacyPolicyPage extends StatelessWidget {
  const PrivacyPolicyPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Privacy Policy")),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Icon(Icons.privacy_tip, size: 100, color: Theme.of(context).colorScheme.primary),
          const SizedBox(height: 20),
          Text(
            "Privacy Policy",
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: Theme.of(context).colorScheme.primary,
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            "We value your privacy. TapTag does not share, sell, or disclose your data to any third-party services or advertisers. All data is used strictly within the application for attendance tracking and system operation purposes only.",
            style: TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 20),
          const Text(
            "Data like names, attendance times, RFID information, and network identifiers are stored securely and used solely to provide expected functionality.",
            style: TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 20),
          const Text(
            "If you have any concerns, feel free to contact us at dev.smq@gmail.com.",
            style: TextStyle(fontSize: 16),
          ),
        ],
      ),
    );
  }
}

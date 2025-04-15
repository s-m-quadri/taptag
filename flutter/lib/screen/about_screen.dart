import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class AboutPage extends StatefulWidget {
  const AboutPage({super.key});

  @override
  State<AboutPage> createState() => _AboutPageState();
}

class _AboutPageState extends State<AboutPage> {
  void _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  void _launchEmail(String email) {
    final Uri emailUri = Uri(scheme: 'mailto', path: email);
    launchUrl(emailUri);
  }

  Widget _linkButton(String label, String url, {IconData icon = Icons.link}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      child: FilledButton.icon(icon: Icon(icon, size: 18), label: Text(label), onPressed: () => _launchUrl(url)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("About")),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Icon(Icons.info_outline, size: 100, color: Theme.of(context).colorScheme.primary),
          const SizedBox(height: 20),

          Text(
            "TapTag",
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: Theme.of(context).colorScheme.primary,
            ),
          ),

          const SizedBox(height: 10),
          const Text(
            "TapTag is a smart RFID-based attendance system built with an ESP32 microcontroller, RFID module, and a Flutter app. It allows real-time attendance tracking over Wi-Fi using secure communication and a user-friendly interface.",
            style: TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _linkButton("GitHub – TapTag", "https://github.com/s-m-quadri/taptag", icon: Icons.storage),
              FilledButton.icon(
                icon: const Icon(Icons.email),
                label: const Text("dev.smq@gmail.com"),
                onPressed: () => _launchEmail("dev.smq@gmail.com"),
              ),
            ],
          ),

          const SizedBox(height: 30),
          Divider(thickness: 2, color: Theme.of(context).colorScheme.primary.withAlpha(50)),
          const SizedBox(height: 10),
          Text(
            "Authors",
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
              fontSize: 24,
              color: Theme.of(context).colorScheme.primary,
            ),
          ),
          const SizedBox(height: 10),

          RichText(
            text: TextSpan(
              style: Theme.of(context).textTheme.bodyMedium,
              children: [
                TextSpan(
                  text: "1. Pawan Ramesh Pawar",
                  style: TextStyle(fontSize: 18, color: Theme.of(context).colorScheme.primary),
                ),
                TextSpan(text: "\nRoll: MT24F11F001, Role: Financial Support."),
              ],
            ),
          ),
          const SizedBox(height: 10),

          RichText(
            text: TextSpan(
              style: Theme.of(context).textTheme.bodyMedium,
              children: [
                TextSpan(
                  text: "2. Yashashree S. Sawargaonkar",
                  style: TextStyle(fontSize: 18, color: Theme.of(context).colorScheme.primary),
                ),
                TextSpan(text: "\nRoll: MT24F11F004, Role: Financial Support."),
              ],
            ),
          ),
          const SizedBox(height: 10),

          RichText(
            text: TextSpan(
              style: Theme.of(context).textTheme.bodyMedium,
              children: [
                TextSpan(
                  text: "3. Shubham Madane",
                  style: TextStyle(fontSize: 18, color: Theme.of(context).colorScheme.primary),
                ),
                TextSpan(text: "\nRoll: MT24F05F007, Role: Advisor."),
              ],
            ),
          ),
          const SizedBox(height: 10),

          RichText(
            text: TextSpan(
              style: Theme.of(context).textTheme.bodyMedium,
              children: [
                TextSpan(
                  text: "4. Syed Minnatullah Quadri",
                  style: TextStyle(fontSize: 18, color: Theme.of(context).colorScheme.primary),
                ),
                TextSpan(
                  text: "\nRoll: MT24F05F001, Role: Lead Development - Full Stack Flutter, Express, and Arduino.",
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),

          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _linkButton("LinkedIn", "https://www.linkedin.com/in/s-m-quadri/", icon: Icons.person),
              _linkButton("Website", "https://s-m-quadri.me/", icon: Icons.web),
              _linkButton("GitHub", "https://github.com/s-m-quadri", icon: Icons.code),
            ],
          ),
          const SizedBox(height: 200),
        ],
      ),
    );
  }
}

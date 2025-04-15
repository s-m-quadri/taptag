import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taptag/model/user.model.dart';
import 'package:taptag/screen/about_screen.dart';
import 'package:taptag/screen/login_screen.dart';
import 'package:taptag/screen/privacy_screen.dart';

class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProvider>(context).user;

    if (user == null) {
      Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const AuthScreen()), (route) => false);
      return const Center(child: CircularProgressIndicator());
    }

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const SizedBox(height: 50),
        Icon(Icons.badge, size: 140, color: Theme.of(context).colorScheme.primary),
        const SizedBox(height: 10),
        Text(
          "TapTag",
          style: Theme.of(context).textTheme.headlineLarge?.copyWith(
            fontSize: 32,
            color: Theme.of(context).colorScheme.primary,
            fontWeight: FontWeight.bold,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 20),
        Text(
          "TapTag is a smart attendance system that uses RFID technology to track attendance efficiently.",
          style: Theme.of(context).textTheme.bodyLarge,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 30),
        ListTile(
          title: Text(
            "${user.name?.toUpperCase()} (As ${user.type?.toUpperCase()})",
            style: TextStyle(fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.primary),
          ),
          subtitle: Text("Contact: ${user.mobileNo} (${user.email})"),
          leading: Icon(Icons.person, color: Theme.of(context).colorScheme.primary),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
        const SizedBox(height: 20),
        ListTile(
          leading: Icon(Icons.info_outline, color: Theme.of(context).colorScheme.primary),
          title: const Text("About"),
          tileColor: Theme.of(context).colorScheme.primary.withAlpha(50),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          onTap: () {
            Navigator.push(context, MaterialPageRoute(builder: (context) => const AboutPage()));
          },
        ),
        const SizedBox(height: 20),
        ListTile(
          leading: Icon(Icons.privacy_tip_outlined, color: Theme.of(context).colorScheme.primary),
          title: const Text("Privacy Policy"),
          tileColor: Theme.of(context).colorScheme.primary.withAlpha(50),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          onTap: () {
            Navigator.push(context, MaterialPageRoute(builder: (context) => const PrivacyPolicyPage()));
          },
        ),
        const SizedBox(height: 200),
      ],
    );
  }
}

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taptag/screen/auth_screen.dart';
import 'package:taptag/model/theme.model.dart';
import 'package:taptag/model/user.model.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProvider>(context).user;
    final themeProvider = Provider.of<ThemeProvider>(context, listen: false);

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
      body:
          user == null
              ? const Center(child: CircularProgressIndicator())
              : Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Name: ${user.name}'),
                    Text('Email: ${user.email}'),
                    Text('Mobile: ${user.mobileNo}'),
                    Text('Type: ${user.type}'),
                    Text('Verified Email: ${user.verifiedEmail}'),
                    Text('Verified Mobile: ${user.verifiedMobileNo}'),
                  ],
                ),
              ),
    );
  }
}

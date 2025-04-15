import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taptag/model/theme.model.dart';
import 'package:taptag/screen/tab_attendance_form.dart';
import 'package:taptag/screen/login_screen.dart';
import 'package:taptag/model/user.model.dart';
import 'package:taptag/screen/tab_history.dart';
import 'package:taptag/screen/tab_profile.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _tabs = const [ProfileTab(), AttendanceStepperPage(), HistoryTab()];

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context, listen: false);

    return Scaffold(
      appBar: AppBar(
        title: const Text("TapTag"),
        actions: [
          IconButton(icon: const Icon(Icons.brightness_6), onPressed: () => themeProvider.toggleTheme()),
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
      body: _tabs[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (newIndex) => setState(() => _currentIndex = newIndex),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.person), label: "Profile"),
          BottomNavigationBarItem(icon: Icon(Icons.how_to_reg), label: "Attendance"),
          BottomNavigationBarItem(icon: Icon(Icons.history), label: "History"),
        ],
      ),
    );
  }
}

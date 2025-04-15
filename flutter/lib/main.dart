import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taptag/model/attendance.model.dart';
import 'package:taptag/model/reader.model.dart';
import 'package:taptag/screen/login_screen.dart';
import 'package:taptag/model/theme.model.dart';
import 'package:taptag/model/user.model.dart';
import 'package:taptag/model/rfid.model.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => ReaderProvider()),
        ChangeNotifierProvider(create: (_) => RFIDProvider()),
        ChangeNotifierProvider(create: (_) => AttendanceProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Auth App',
      themeMode: themeProvider.themeMode,
      theme: themeProvider.lightTheme,
      darkTheme: themeProvider.darkTheme,
      home: const AuthScreen(),
    );
  }
}

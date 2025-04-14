import 'package:flutter/material.dart';

class ThemeProvider with ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.light;

  ThemeMode get themeMode => _themeMode;

  void toggleTheme() {
    _themeMode = _themeMode == ThemeMode.light ? ThemeMode.dark : ThemeMode.light;
    notifyListeners();
  }

  ThemeData get lightTheme =>
      ThemeData(brightness: Brightness.light, colorSchemeSeed: Colors.lightBlue, useMaterial3: true);

  ThemeData get darkTheme =>
      ThemeData(brightness: Brightness.dark, colorSchemeSeed: Colors.lightBlue, useMaterial3: true);
}

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

final String baseUrl = 'https://api.taptag.s-m-quadri.me';

class UserModel {
  final String? type;
  final String mobileNo;
  final String? password;
  final String? name;
  final String? email;
  final String? img;
  final bool verifiedMobileNo;
  final bool verifiedEmail;
  final bool verified;
  final bool suspended;
  final int? lastLogin;

  UserModel({
    this.type,
    required this.mobileNo,
    this.password,
    this.name,
    this.email,
    this.img,
    this.verifiedMobileNo = false,
    this.verifiedEmail = false,
    this.verified = false,
    this.suspended = false,
    this.lastLogin,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      type: json['type'] ?? 'other',
      mobileNo: json['mobileNo'],
      password: json['password'],
      name: json['name'],
      email: json['email'],
      img: json['img'],
      verifiedMobileNo: json['verifiedMobileNo'] ?? false,
      verifiedEmail: json['verifiedEmail'] ?? false,
      verified: json['verified'] ?? false,
      suspended: json['suspended'] ?? false,
      lastLogin: json['lastLogin'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type': type,
      'mobileNo': mobileNo,
      'password': password,
      'name': name,
      'email': email,
      'img': img,
      'verifiedMobileNo': verifiedMobileNo,
      'verifiedEmail': verifiedEmail,
      'verified': verified,
      'suspended': suspended,
      'lastLogin': lastLogin,
    };
  }
}

class UserProvider with ChangeNotifier {
  UserModel? _user;
  String? _token;

  UserModel? get user => _user;
  String? get token => _token;

  Future<void> registerUser(UserModel newUser) async {
    final url = Uri.parse('$baseUrl/auth/register');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode(newUser.toJson()),
    );

    if (response.statusCode == 200) {
      debugPrint('✅ Registration successful');
    } else {
      throw Exception('❌ Registration failed: ${response.body}');
    }
  }

  Future<void> login(String mobileNo, String password) async {
    final url = Uri.parse('$baseUrl/auth/login');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'mobileNo': mobileNo, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      _token = data['result']['secret'];
      await _saveTokenToStorage(_token!);
      debugPrint('✅ Login successful');
      _user = UserModel(mobileNo: mobileNo);
      await fetchCurrentUser();
    } else {
      throw Exception('❌ Login failed: ${response.body}');
    }
  }

  Future<void> fetchCurrentUser() async {
    if (_token == null) await _loadTokenFromStorage();

    final url = Uri.parse('$baseUrl/user');
    final response = await http.get(url, headers: {'Authorization': _token ?? ''});

    if (response.statusCode == 200) {
      final userData = json.decode(response.body);
      final result = userData['result'];
      final myUser = (result as List).firstWhere((e) => e['mobileNo'] == _user?.mobileNo);
      _user = UserModel.fromJson(myUser);
      notifyListeners();
    } else {
      throw Exception('❌ Failed to fetch user: ${response.body}');
    }
  }

  Future<void> logout() async {
    _user = null;
    _token = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    notifyListeners();
  }

  Future<void> _saveTokenToStorage(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }

  Future<void> _loadTokenFromStorage() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('token');
  }
}

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:taptag/model/theme.model.dart';
import 'package:taptag/model/user.model.dart';
import 'package:taptag/screen/register_screen.dart';
import 'package:taptag/screen/home_screen.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _formKey = GlobalKey<FormState>();
  String mobileNo = '';
  String password = '';
  bool isLoading = false;

  void _login() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      setState(() => isLoading = true);
      try {
        await Provider.of<UserProvider>(context, listen: false).login(mobileNo, password);
        if (!mounted) return;
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const HomeScreen()));
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
      }
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context, listen: false);

    return Scaffold(
      appBar: AppBar(
        title: const Text("Login"),
        actions: [
          IconButton(
            icon: const Icon(Icons.brightness_6),
            onPressed: () {
              themeProvider.toggleTheme();
            },
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            SizedBox(height: 50),
            Icon(Icons.shield_outlined, size: 150, color: Theme.of(context).colorScheme.primary),
            const SizedBox(height: 10),
            Text(
              "Login",
              style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                fontSize: 42,
                color: Theme.of(context).colorScheme.primary,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 20),
            TextFormField(
              decoration: InputDecoration(
                labelText: 'Mobile Number',
                border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(10.0))),
                prefixIcon: Icon(Icons.phone_outlined),
              ),
              maxLength: 10,
              inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[0-9]'))],
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || !RegExp(r'^[0-9]{10,10}$').hasMatch(value)) {
                  return 'Enter a valid 10-digit mobile number';
                }
                return null;
              },
              onChanged: (value) => mobileNo = value.trim(),
            ),
            const SizedBox(height: 10),
            TextFormField(
              obscureText: true,
              decoration: InputDecoration(
                labelText: 'Password',
                border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(10.0))),
                prefixIcon: Icon(Icons.key_outlined),
              ),
              keyboardType: TextInputType.visiblePassword,
              validator: (value) {
                if (value == null || value.length < 6) {
                  return 'Password must be at least 6 characters';
                }
                return null;
              },
              onChanged: (value) => password = value.trim(),
            ),
            const SizedBox(height: 20),
            isLoading
                ? const CircularProgressIndicator()
                : FilledButton(
                  onPressed: _login,
                  style: ButtonStyle(
                    shape: WidgetStateProperty.all<RoundedRectangleBorder>(
                      RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
                    ),
                  ),
                  child: const Text('Login', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ),
            TextButton(
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterScreen())),
              child: const Text(
                "(WIP) Don't have an account? Register",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

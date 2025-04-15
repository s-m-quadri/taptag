import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:taptag/model/user.model.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  String mobileNo = '', email = '', name = '', type = 'student', password = '';
  bool isLoading = false;

  void _register() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      setState(() => isLoading = true);

      final user = UserModel(mobileNo: mobileNo, email: email, name: name, type: type, password: password);

      try {
        await Provider.of<UserProvider>(context, listen: false).registerUser(user);

        if (!mounted) return;
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(const SnackBar(content: Text('Registration successful! Please login.')));
        Navigator.pop(context); // Back to login
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
      }

      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("TapTag | Request Access")),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            SizedBox(height: 50),
            Icon(Icons.health_and_safety_outlined, size: 150, color: Theme.of(context).colorScheme.primary),
            const SizedBox(height: 10),
            Text(
              "Register",
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
              decoration: InputDecoration(
                labelText: 'Email',
                border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(10.0))),
                prefixIcon: Icon(Icons.email_outlined),
              ),
              keyboardType: TextInputType.emailAddress,
              validator: (value) {
                if (value == null || !RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$').hasMatch(value)) {
                  return 'Enter a valid email address';
                }
                return null;
              },
              onChanged: (value) => email = value.trim(),
            ),
            const SizedBox(height: 20),
            TextFormField(
              decoration: InputDecoration(
                labelText: 'Name',
                border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(10.0))),
                prefixIcon: Icon(Icons.person_outline),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Enter your name';
                }
                return null;
              },
              onChanged: (value) => name = value.trim(),
            ),
            const SizedBox(height: 20),

            // DropdownButtonFormField<String>(
            //   value: type,
            //   items:
            //       ['student', 'teacher', 'parent', 'other'].map((role) {
            //         return DropdownMenuItem(value: role, child: Text(role));
            //       }).toList(),
            //   onChanged: (val) => setState(() => type = val!),
            //   decoration: const InputDecoration(labelText: 'Type'),
            // ),
            DropdownButtonFormField<String>(
              value: type,
              items:
                  ['student', 'teacher', 'parent', 'other'].map((role) {
                    return DropdownMenuItem(value: role, child: Text(role.toUpperCase()));
                  }).toList(),
              onChanged: (val) => setState(() => type = val!),
              decoration: InputDecoration(
                labelText: 'Type',
                border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(10.0))),
                prefixIcon: Icon(Icons.person_outline),
              ),
            ),
            const SizedBox(height: 20),
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
            FilledButton(
              onPressed: isLoading ? null : _register,
              style: ButtonStyle(
                shape: WidgetStateProperty.all<RoundedRectangleBorder>(
                  RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
                ),
              ),
              child:
                  isLoading
                      ? SizedBox(height: 14, width: 14, child: CircularProgressIndicator(strokeWidth: 5))
                      : const Text('Request Access', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 10),
            Text(
              "As a next step, you must contact at dev.smq@gmail.com for verification of your account. This is just an registration from.",
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 200),
          ],
        ),
      ),
    );
  }
}

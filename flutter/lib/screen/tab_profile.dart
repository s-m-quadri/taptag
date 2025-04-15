import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taptag/model/user.model.dart';

class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<UserProvider>(context).user;

    if (user == null) {
      return const Center(child: CircularProgressIndicator());
    }

    return Padding(
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
    );
  }
}

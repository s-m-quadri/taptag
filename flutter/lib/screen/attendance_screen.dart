import 'package:flutter/material.dart';
import 'package:taptag/model/attendance.model.dart';

class AttendanceDetailPage extends StatelessWidget {
  final AttendanceResult attendance;

  const AttendanceDetailPage({super.key, required this.attendance});

  String _formatTimestamp(int timestamp) {
    final date = DateTime.fromMillisecondsSinceEpoch(timestamp);
    return "${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')} on ${date.day}/${date.month}/${date.year}";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Attendance Details')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          SizedBox(height: 50),
          Icon(Icons.groups_outlined, size: 84, color: Theme.of(context).colorScheme.primary),
          Text(
            "Attendance",
            style: Theme.of(context).textTheme.headlineLarge?.copyWith(
              fontSize: 32,
              color: Theme.of(context).colorScheme.primary,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),
          Text(
            "Date",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Theme.of(context).colorScheme.primary),
          ),
          Text(attendance.date, style: Theme.of(context).textTheme.bodyLarge),

          const SizedBox(height: 10),
          Text(
            "Reason",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Theme.of(context).colorScheme.primary),
          ),
          Text(attendance.reason.isEmpty ? "—" : attendance.reason),

          const SizedBox(height: 10),
          Divider(thickness: 2, color: Theme.of(context).colorScheme.primary.withAlpha(50)),
          const SizedBox(height: 10),
          Text(
            "Attendance Type",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Theme.of(context).colorScheme.primary),
          ),
          Text(attendance.isOut ? "For Exit" : "For Entry"),

          const SizedBox(height: 10),
          Text(
            "Time In",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Theme.of(context).colorScheme.primary),
          ),
          Text(_formatTimestamp(attendance.timeIn)),

          const SizedBox(height: 10),
          Text(
            "Time Out",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Theme.of(context).colorScheme.primary),
          ),
          Text(_formatTimestamp(attendance.timeOut)),

          const SizedBox(height: 10),
          Divider(thickness: 2, color: Theme.of(context).colorScheme.primary.withAlpha(50)),
          const SizedBox(height: 10),
          Text(
            "Reader",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Theme.of(context).colorScheme.primary),
          ),
          ListTile(
            leading: const Icon(Icons.badge_outlined),
            title: Text(attendance.reader.name),
            subtitle: Text(attendance.reader.ssid),
            trailing:
                attendance.reader.isActive
                    ? Icon(Icons.check_outlined, color: Theme.of(context).colorScheme.primary)
                    : Icon(Icons.cancel_outlined, color: Theme.of(context).colorScheme.error),
          ),
          if (attendance.reader.description != null)
            Padding(padding: const EdgeInsets.symmetric(vertical: 2), child: Text(attendance.reader.description!)),

          const SizedBox(height: 10),
          Divider(thickness: 2, color: Theme.of(context).colorScheme.primary.withAlpha(50)),
          const SizedBox(height: 10),
          Text(
            "Students (${attendance.students.length})",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Theme.of(context).colorScheme.primary),
          ),
          ...attendance.students.map(
            (student) => ListTile(
              leading: const Icon(Icons.person_outlined),
              dense: true,
              title: Text("${student.name} (${student.email})"),
              trailing:
                  student.suspended
                      ? Icon(Icons.cancel_outlined, color: Theme.of(context).colorScheme.error)
                      : Icon(Icons.check_outlined, color: Theme.of(context).colorScheme.primary),
            ),
          ),
          const SizedBox(height: 200),
        ],
      ),
    );
  }
}

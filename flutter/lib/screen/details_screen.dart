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
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(
          children: [
            _sectionTitle("📅 Date"),
            Text(attendance.date, style: Theme.of(context).textTheme.bodyLarge),

            const SizedBox(height: 16),
            _sectionTitle("🕓 Time In"),
            Text(_formatTimestamp(attendance.timeIn)),

            const SizedBox(height: 8),
            _sectionTitle("🕔 Time Out"),
            Text(_formatTimestamp(attendance.timeOut)),

            const SizedBox(height: 16),
            _sectionTitle("📍 Reader"),
            _infoRow("Name", attendance.reader.name),
            _infoRow("SSID", attendance.reader.ssid),
            _infoRow("Active", attendance.reader.isActive ? "Yes" : "No"),
            if (attendance.reader.description != null) _infoRow("Description", attendance.reader.description!),

            const SizedBox(height: 16),
            _sectionTitle("📚 Reason"),
            Text(attendance.reason.isEmpty ? "—" : attendance.reason),

            const SizedBox(height: 16),
            _sectionTitle("🔁 Attendance Type"),
            Text(attendance.isOut ? "OUT" : "IN"),

            const SizedBox(height: 16),
            _sectionTitle("🧑‍🎓 Students Present (${attendance.students.length})"),
            ...attendance.students.map(
              (student) => ListTile(
                leading: const Icon(Icons.person),
                title: Text(student.name ?? "Unknown"),
                subtitle: Text(student.email ?? "Unknown"),
                trailing:
                    student.suspended
                        ? const Icon(Icons.block, color: Colors.red)
                        : const Icon(Icons.check_circle, color: Colors.green),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _sectionTitle(String text) {
    return Text(text, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18));
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(children: [Expanded(flex: 2, child: Text("$label:")), Expanded(flex: 3, child: Text(value))]),
    );
  }
}

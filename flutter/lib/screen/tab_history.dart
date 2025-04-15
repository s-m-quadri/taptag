import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taptag/model/attendance.model.dart';
import 'package:taptag/model/user.model.dart';
import 'package:taptag/screen/attendance_screen.dart';

class HistoryTab extends StatefulWidget {
  const HistoryTab({super.key});

  @override
  State<HistoryTab> createState() => _HistoryTabState();
}

class _HistoryTabState extends State<HistoryTab> {
  Future<void> refresh() async {
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    final attendanceProvider = Provider.of<AttendanceProvider>(context, listen: false);
    if (userProvider.token == null) return;
    try {
      await attendanceProvider.fetchAllAttendance(userProvider.token!);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      refresh();
    });
  }

  @override
  Widget build(BuildContext context) {
    final attendanceResults = Provider.of<AttendanceProvider>(context).attendanceResults;

    if (attendanceResults.isEmpty) {
      return const Center(child: Text("No attendance records found."));
    }

    return RefreshIndicator(
      onRefresh: refresh,
      child: ListView.builder(
        itemCount: attendanceResults.length,
        itemBuilder: (context, index) {
          final result = attendanceResults[index];
          var timeString = "";
          if (result.isOut) {
            timeString = DateTime.fromMillisecondsSinceEpoch(
              result.timeOut,
            ).toLocal().toIso8601String().substring(11, 16);
          } else {
            timeString = DateTime.fromMillisecondsSinceEpoch(
              result.timeIn,
            ).toLocal().toIso8601String().substring(11, 16);
          }
          return ListTile(
            title: Text(
              "${result.date} @$timeString",
              style: TextStyle(fontWeight: FontWeight.bold, color: Theme.of(context).colorScheme.primary),
            ),
            subtitle: Text(
              "For ${result.reason.toUpperCase()} (${result.isOut ? "Exit" : "Entry"} of ${result.students.length} students)",
            ),
            leading: Icon(Icons.groups_outlined, color: Theme.of(context).colorScheme.primary),
            trailing: const Icon(Icons.arrow_forward),
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => AttendanceDetailPage(attendance: result)));
            },
          );
        },
      ),
    );
  }
}

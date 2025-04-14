import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:taptag/model/attendance.model.dart';
import 'package:taptag/screen/details_screen.dart';

class HistoryTab extends StatelessWidget {
  const HistoryTab({super.key});

  @override
  Widget build(BuildContext context) {
    final attendanceResults = Provider.of<AttendanceProvider>(context).attendanceResults;

    if (attendanceResults.isEmpty) {
      return const Center(child: Text("No attendance records found."));
    }

    return ListView.builder(
      itemCount: attendanceResults.length,
      itemBuilder: (context, index) {
        final result = attendanceResults[index];
        return ListTile(
          title: Text("Date: ${result.date}"),
          subtitle: Text(result.reason),
          trailing: const Icon(Icons.arrow_forward),
          onTap: () {
            Navigator.push(context, MaterialPageRoute(builder: (_) => AttendanceDetailPage(attendance: result)));
          },
        );
      },
    );
  }
}

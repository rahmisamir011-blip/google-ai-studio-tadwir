import 'package:flutter/material.dart';

void showVoiceResultModal(BuildContext context, String result) {
  showDialog(
    context: context,
    builder: (context) {
      return AlertDialog(
        title: const Text('Voice Search Result'),
        content: Text(result),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
        ],
      );
    },
  );
}

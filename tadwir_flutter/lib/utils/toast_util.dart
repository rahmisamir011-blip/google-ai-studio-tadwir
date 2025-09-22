import 'package:flutter/material.dart';

class ToastUtil {
  static final messengerKey = GlobalKey<ScaffoldMessengerState>();

  static void showToast(String message) {
    final snackBar = SnackBar(content: Text(message));
    messengerKey.currentState?.showSnackBar(snackBar);
  }
}

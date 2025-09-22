import 'package:flutter/material.dart';
import './dashboard_screen.dart';
import './main_screen.dart';
import './achievements_screen.dart';

class AppShell extends StatefulWidget {
  const AppShell({Key? key}) : super(key: key);

  @override
  _AppShellState createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _selectedIndex = 0;

  // We need to build the widgets dynamically to pass arguments
  Widget _getScreen(int index) {
    switch (index) {
      case 0:
        return DashboardScreen(onNavigate: _onItemTapped);
      case 1:
        return const MainScreen(initialTabIndex: 0); // Camera
      case 2:
        return const MainScreen(initialTabIndex: 1); // Library
      case 3:
        return const AchievementsScreen();
      default:
        return DashboardScreen(onNavigate: _onItemTapped);
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _getScreen(_selectedIndex),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.camera_alt),
            label: 'Camera',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: 'Library',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.star),
            label: 'Achievements',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.amber[800],
        unselectedItemColor: Colors.grey,
        onTap: _onItemTapped,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}

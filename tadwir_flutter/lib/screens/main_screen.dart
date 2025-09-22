import 'package:flutter/material.dart';
import '../widgets/camera_tab.dart';
import '../widgets/library_tab.dart';

class MainScreen extends StatefulWidget {
  final int initialTabIndex;

  const MainScreen({Key? key, this.initialTabIndex = 0}) : super(key: key);

  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this, initialIndex: widget.initialTabIndex);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan & Search'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(icon: Icon(Icons.camera_alt), text: 'Camera'),
            Tab(icon: Icon(Icons.search), text: 'Library'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: const [
          CameraTab(),
          LibraryTab(),
        ],
      ),
    );
  }
}

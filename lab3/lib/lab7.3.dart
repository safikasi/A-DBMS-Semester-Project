import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: CombinedPage(),
    );
  }
}

class CombinedPage extends StatefulWidget {
  @override
  _CombinedPageState createState() => _CombinedPageState();
}

class _CombinedPageState extends State<CombinedPage> {
  int _currentIndex = 0;
  final List<Widget> _pages = [
    CountdownTimerPage(),
    ApiFetchPage(),
    DatabaseQueryPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.timer), label: 'Timer'),
          BottomNavigationBarItem(icon: Icon(Icons.data_usage), label: 'API'),
          BottomNavigationBarItem(icon: Icon(Icons.storage), label: 'Database'),
        ],
      ),
    );
  }
}

// Countdown Timer Page
class CountdownTimerPage extends StatefulWidget {
  @override
  _CountdownTimerPageState createState() => _CountdownTimerPageState();
}

class _CountdownTimerPageState extends State<CountdownTimerPage> {
  int _remainingSeconds = 60;
  bool _isRunning = false;

  void _startTimer() {
    if (_isRunning) return;

    setState(() {
      _isRunning = true;
    });

    _countdown();
  }

  void _countdown() {
    if (_remainingSeconds > 0) {
      Future.delayed(Duration(seconds: 1), () {
        setState(() {
          _remainingSeconds--;
        });
        _countdown();
      });
    } else {
      setState(() {
        _isRunning = false;
        _remainingSeconds = 60;
      });
    }
  }

  void _resetTimer() {
    setState(() {
      _remainingSeconds = 60;
      _isRunning = false;
    });
  }

  String _formatTime(int seconds) {
    int minutes = seconds ~/ 60;
    int remainingSeconds = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${remainingSeconds.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Countdown Timer')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              _formatTime(_remainingSeconds),
              style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _isRunning ? null : _startTimer,
              child: Text('Start'),
            ),
            ElevatedButton(onPressed: _resetTimer, child: Text('Reset')),
          ],
        ),
      ),
    );
  }
}

// API Fetch Page
class ApiFetchPage extends StatefulWidget {
  @override
  _ApiFetchPageState createState() => _ApiFetchPageState();
}

class _ApiFetchPageState extends State<ApiFetchPage> {
  String _data = 'Press the button to fetch data';
  bool _isLoading = false;

  Future<void> _fetchData() async {
    setState(() {
      _isLoading = true;
    });

    await Future.delayed(Duration(seconds: 2), () {
      setState(() {
        _data = 'Fetched API data successfully!';
        _isLoading = false;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('API Fetch')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (_isLoading) CircularProgressIndicator() else Text(_data),
            SizedBox(height: 20),
            ElevatedButton(onPressed: _fetchData, child: Text('Fetch Data')),
          ],
        ),
      ),
    );
  }
}

// Database Query Page
class DatabaseQueryPage extends StatefulWidget {
  @override
  _DatabaseQueryPageState createState() => _DatabaseQueryPageState();
}

class _DatabaseQueryPageState extends State<DatabaseQueryPage> {
  List<String>? _databaseData;
  bool _isLoading = false;

  Future<void> _fetchDatabaseData() async {
    setState(() {
      _isLoading = true;
    });

    await Future.delayed(Duration(seconds: 2), () {
      setState(() {
        _databaseData = [
          'Record 1: User A',
          'Record 2: User B',
          'Record 3: User C',
          'Record 4: User D',
        ];
        _isLoading = false;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Database Query')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (_isLoading)
              CircularProgressIndicator()
            else if (_databaseData != null)
              Expanded(
                child: ListView.builder(
                  itemCount: _databaseData!.length,
                  itemBuilder: (context, index) {
                    return ListTile(title: Text(_databaseData![index]));
                  },
                ),
              )
            else
              Text('Press the button to fetch database data'),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _fetchDatabaseData,
              child: Text('Fetch Data'),
            ),
          ],
        ),
      ),
    );
  }
}

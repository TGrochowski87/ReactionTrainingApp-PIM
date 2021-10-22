import 'dart:collection';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LeaderboardDrawer extends StatefulWidget {
  const LeaderboardDrawer({Key? key}) : super(key: key);

  @override
  State<LeaderboardDrawer> createState() => _LeaderboardDrawerState();
}

class Score {
  final String name;
  final int points;
  Score(this.name, this.points);
}

class _LeaderboardDrawerState extends State<LeaderboardDrawer> {
  late SplayTreeMap<String, int> leaderboardData;
  List<Score> leaders = [
    Score('NoData', 0),
    Score('NoData', 0),
    Score('NoData', 0)
  ];

  Future<void> getData() async {
    final prefs = await SharedPreferences.getInstance();
    final keys = prefs.getKeys();
    final prefsMap = Map<String, int>();
    for (String key in keys) {
      prefsMap[key] = prefs.getInt(key) ?? 0;
    }

    final sortedMap = SplayTreeMap<String, int>.from(prefsMap,
        (key1, key2) => prefsMap[key1]!.compareTo(prefsMap[key2] ?? 0));

    setState(() {
      for (String key in keys) {
        leaders.add(Score(key, prefs.getInt(key) ?? 0));

        leaders
            .sort((score1, score2) => score2.points.compareTo(score1.points));
      }
    });
  }

  @override
  void initState() {
    getData();
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        children: [
          DrawerHeader(
            decoration: BoxDecoration(color: Colors.green.shade700),
            child:
                Text('Leaderboard \u{1f396}', style: TextStyle(fontSize: 28)),
          ),
          ListTile(
              leading: Icon(
                Icons.emoji_events_rounded,
                color: Colors.amber.shade800,
              ),
              title: Text('${leaders[0].name}'),
              subtitle: Text('${leaders[0].points}')),
          ListTile(
              leading: Icon(
                Icons.emoji_events_rounded,
                color: Colors.grey.shade700,
              ),
              title: Text('${leaders[1].name}'),
              subtitle: Text('${leaders[1].points}')),
          ListTile(
              leading: Icon(
                Icons.emoji_events_rounded,
                color: Colors.brown.shade600,
              ),
              title: Text('${leaders[2].name}'),
              subtitle: Text('${leaders[2].points}')),
        ],
      ),
    );
  }
}

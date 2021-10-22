import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_application_1/leaderboard_drawer.dart';
import 'package:flutter_application_1/screens/training_screen.dart';
import 'package:flutter_application_1/shared/difficulty.dart';
import 'package:flutter_application_1/shared/training_theme.dart';

class MenuScreen extends StatefulWidget {
  const MenuScreen({Key? key}) : super(key: key);

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  final TextEditingController txtUserName = TextEditingController();
  final double fontSize = 18;
  final List<TrainingTheme> themes = [
    TrainingTheme(Colors.green.shade500, Colors.red),
    TrainingTheme(Colors.blue.shade700, Colors.yellow.shade700),
    TrainingTheme(Colors.pink.shade300, Colors.purple.shade800),
    TrainingTheme(Colors.blue.shade400, Colors.pink.shade300),
    TrainingTheme(Colors.yellow.shade700, Colors.purple.shade800)
  ];

  TrainingTheme activeTheme = TrainingTheme(Colors.green.shade500, Colors.red);
  double _sliderValue = 0;
  String about = """Game starts after a short countdown.

Tap the glowing square as fast as you
can to get the points.
The higher defficulty you choose, the
more points you get!
Any missclicks will cost you 1 point

Game ends after 20 attempts.
The fastest and most precise players
will be featured on the leaderboard.""";

  String mode(double d) {
    if (d == 0) {
      return "EASY\nTime to click: 800 ms";
    } else if (d == 1) {
      return "MEDIUM\nTime to click: 500 ms";
    }
    return "HARD\nTime to click: 300 ms";
  }

  @override
  void initState() {
    activeTheme = themes[0];
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade300,
      appBar: AppBar(
        leading: Builder(builder: (context) {
          return IconButton(
            icon: Icon(Icons.leaderboard),
            onPressed: () => {Scaffold.of(context).openDrawer()},
          );
        }),
        title: const Text('Reaction Training App'),
        actions: const [Padding(padding: EdgeInsets.symmetric(horizontal: 10))],
      ),
      drawer: LeaderboardDrawer(),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 15),
          child: Column(
            children: [
              generateUserNameInput(),
              generateDifficultyChooser(),
              generateThemeChooser(),
              generateButtons()
            ],
          ),
        ),
      ),
    );
  }

  Widget generateUserNameInput() {
    return Padding(
      padding: const EdgeInsets.only(left: 24, right: 24, top: 45, bottom: 40),
      child: TextFormField(
        controller: txtUserName,
        decoration: const InputDecoration(
            hintText: 'Anonymous',
            border: OutlineInputBorder(),
            labelText: 'Your name'),
        keyboardType: TextInputType.text,
        maxLength: 20,
        autofocus: false,
      ),
    );
  }

  Widget generateDifficultyChooser() {
    return Column(
      children: [
        Text('Choose game difficulty', style: TextStyle(fontSize: fontSize)),
        Slider(
            value: _sliderValue,
            min: 0,
            max: 2,
            divisions: 2,
            label: mode(_sliderValue),
            onChanged: (value) {
              setState(() {
                _sliderValue = value;
              });
            }),
      ],
    );
  }

  Widget generateThemeChooser() {
    return Padding(
      padding: const EdgeInsets.only(top: 30, bottom: 60),
      child: Column(
        children: [
          Text('Select game theme', style: TextStyle(fontSize: fontSize)),
          SizedBox(
              height: 80,
              child: GridView.builder(
                  itemCount: themes.length,
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 5),
                  itemBuilder: (context, index) => Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: InkWell(
                          onTap: () {
                            setState(() {
                              activeTheme = themes[index];
                            });
                          },
                          child: Container(
                            decoration: BoxDecoration(
                                gradient: LinearGradient(
                                    begin: FractionalOffset.topLeft,
                                    end: FractionalOffset.bottomRight,
                                    colors: [
                                      themes[index].active,
                                      themes[index].active,
                                      themes[index].inactive,
                                      themes[index].inactive,
                                    ],
                                    stops: const [
                                      0.0,
                                      0.5,
                                      0.5,
                                      1.0
                                    ]),
                                border: activeTheme == themes[index]
                                    ? Border.all(color: Colors.blue, width: 5)
                                    : Border.all(color: Colors.black87)),
                          ),
                        ),
                      ))),
        ],
      ),
    );
  }

  Widget generateButtons() {
    return Column(children: [
      ElevatedButton(
          onPressed: () => {
                Navigator.of(context).push(MaterialPageRoute(
                    builder: (context) => TrainingScreen(
                          theme: activeTheme,
                          difficulty: Difficulty.values[_sliderValue.toInt()],
                          userName: txtUserName.text.isEmpty
                              ? 'Anonymous'
                              : txtUserName.text,
                        )))
              },
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
            child: Text(
              'TRAIN YOUR REACTION',
              style: TextStyle(fontSize: fontSize),
            ),
          )),
      Padding(
          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                child: Builder(builder: (context) {
                  return ElevatedButton(
                    onPressed: () => {Scaffold.of(context).openDrawer()},
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 34, vertical: 14),
                      child: Icon(Icons.leaderboard),
                    ),
                  );
                }),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                child: ElevatedButton(
                  onPressed: () => showDialog(
                      context: context,
                      builder: (BuildContext context) => AlertDialog(
                            title: Text('About'),
                            content: Text(
                              about,
                            ),
                            actions: <Widget>[
                              TextButton(
                                onPressed: () => {Navigator.pop(context, 'Ok')},
                                child: Text('Ok'),
                              )
                            ],
                          )),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 39, vertical: 10),
                    child: Text('?', style: TextStyle(fontSize: 28)),
                  ),
                ),
              )
            ],
          ))
    ]);
  }
}

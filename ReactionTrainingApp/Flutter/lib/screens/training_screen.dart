import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_application_1/shared/difficulty.dart';
import 'package:flutter_application_1/shared/training_theme.dart';
import 'package:flutter_application_1/training_button.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum GameState { starting, ongoing, finished }

class TrainingScreen extends StatefulWidget {
  const TrainingScreen(
      {Key? key,
      required this.theme,
      required this.difficulty,
      required this.userName})
      : super(key: key);

  final TrainingTheme theme;
  final Difficulty difficulty;
  final String userName;

  @override
  State<TrainingScreen> createState() => _TrainingScreenState();
}

class _TrainingScreenState extends State<TrainingScreen> {
  final Random random = Random();
  final oneSec = Duration(seconds: 1);
  late List<TrainingButton> buttons;

  String startingText = 'Starting in';
  String endingText = 'Training finished';
  String pointsText = 'Points';

  late Timer timer;
  Timer? activeTimer;

  // Game state
  late int startingCounter;
  late GameState gameState;
  late int pointsValue;
  late int attempts;

  Future<void> saveData() async {
    final prefs = await SharedPreferences.getInstance();
    int? best = prefs.getInt(widget.userName);
    if (best == null || best < pointsValue) {
      prefs.setInt(widget.userName, pointsValue);
    }
  }

  void initializeGame() {
    setState(() {
      gameState = GameState.starting;
      pointsValue = 0;
      startingCounter = 3;
      attempts = 20;
    });
  }

  void clearTimers() {
    timer.cancel();
    activeTimer?.cancel();
  }

  void startGameTimer() {
    initializeGame();

    timer = Timer.periodic(oneSec, (Timer timer) {
      if (startingCounter == 0) {
        setState(() {
          timer.cancel();
          gameState = GameState.ongoing;
          gameTimer();
        });
      } else {
        setState(() {
          startingCounter--;
        });
      }
    });
  }

  Duration setPeriodByDifficulty() {
    switch (widget.difficulty) {
      case Difficulty.hard:
        return Duration(milliseconds: 300);
      case Difficulty.medium:
        return Duration(milliseconds: 500);
      case Difficulty.easy:
        return Duration(milliseconds: 800);
      default:
        return Duration(milliseconds: 800);
    }
  }

  void gameTimer() {
    Duration period = setPeriodByDifficulty();

    timer = Timer.periodic(Duration(seconds: 2), (Timer timer) {
      if (attempts > 0) {
        int randomActiveButtonIndex = random.nextInt(9);
        setState(() {
          buttons[randomActiveButtonIndex].active = true;
          attempts--;
        });
        buttons[randomActiveButtonIndex].rebuild();

        activeTimer = Timer(period, () {
          setState(() {
            buttons[randomActiveButtonIndex].active = false;
          });
          buttons[randomActiveButtonIndex].rebuild();
        });
      } else {
        clearTimers();
        saveData();
        setState(() {
          gameState = GameState.finished;
        });
      }
    });
  }

  @override
  void initState() {
    super.initState();
    buttons = List.generate(9, (index) => TrainingButton(theme: widget.theme));
    startGameTimer();
  }

  @override
  void dispose() {
    clearTimers();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.grey.shade300,
        appBar: AppBar(
          title: const Text('Reaction Training App'),
          actions: const [
            Padding(padding: EdgeInsets.symmetric(horizontal: 10))
          ],
        ),
        body: Center(
          child: Column(
            children: [
              generateDescription(),
              generateGameField(),
              generatePlayAgainButton()
            ],
          ),
        ));
  }

  Widget generateDescription() {
    return Padding(
      padding: EdgeInsets.only(top: 15, bottom: 40),
      child: Text(
        gameState == GameState.ongoing
            ? "$pointsText\n$pointsValue"
            : gameState == GameState.starting
                ? "$startingText\n$startingCounter"
                : "$endingText\n$pointsValue",
        style: TextStyle(fontSize: 28),
        textAlign: TextAlign.center,
      ),
    );
  }

  Widget generateGameField() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 15.0),
      child: SizedBox(
          height: 400,
          child: GridView.builder(
              itemCount: buttons.length,
              gridDelegate:
                  SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 3),
              itemBuilder: (context, index) => InkWell(
                    onTap: () {
                      if (buttons[index].active) {
                        setState(() {
                          pointsValue += (1 + widget.difficulty.index);
                          buttons[index].active = false;
                        });
                      } else {
                        setState(() {
                          pointsValue--;
                        });
                      }
                      buttons[index].rebuild();
                    },
                    child: buttons[index],
                  ))),
    );
  }

  Widget generatePlayAgainButton() {
    return gameState == GameState.finished
        ? ElevatedButton(
            onPressed: () => startGameTimer(),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text("Play Again!", style: TextStyle(fontSize: 18)),
            ))
        : Padding(padding: EdgeInsets.all(0));
  }
}

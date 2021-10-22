import 'package:flutter/material.dart';
import 'package:flutter_application_1/shared/training_theme.dart';

class TrainingButton extends StatefulWidget {
  TrainingButton({Key? key, required this.theme}) : super(key: key);

  final TrainingTheme theme;
  bool active = false;
  late State<TrainingButton> _state;

  void rebuild() {
    _state.setState(() {});
  }

  @override
  State<TrainingButton> createState() {
    _state = _TrainingButtonState();
    return _state;
  }
}

class _TrainingButtonState extends State<TrainingButton> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Container(
        decoration: BoxDecoration(
            color: widget.active ? widget.theme.active : widget.theme.inactive,
            border: Border.all(width: 2, color: Colors.black87)),
      ),
    );
  }
}

import React, { useEffect } from "react";
import { Appbar, Button } from "react-native-paper";
import { MaterialIcons } from "react-native-vector-icons";
import { StyleSheet, StatusBar, View, Text, TouchableWithoutFeedback } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../../config/colors";
import TrainingButton from "./TrainingButton";
import { useRef, useState } from "react/cjs/react.development";

const GameState = {
  starting: "Starting in",
  ongoing: "Points",
  finished: "Training finished",
};

export default function TrainingScreen({ navigation, route }) {
  const intervalRef = useRef(null);

  const [timer, setTimer] = useState(3);
  const [gameState, setGameState] = useState(GameState.starting);
  const [pointsValue, setPointsValue] = useState(0);
  const [attempts, setAttempts] = useState(20);
  const [activeId, setActiveId] = useState(-1);

  useEffect(() => {
    startGame();

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      clearInterval(intervalRef.current);
      setGameState(GameState.ongoing);
      setGameTimer();
    }
  }, [timer]);

  useEffect(() => {
    if (attempts <= 0) {
      clearInterval(intervalRef.current);
      saveData();
      setGameState(GameState.finished);
    }
  }, [attempts]);

  const difficultyToMs = () => {
    switch (route.params.difficulty) {
      case 0:
        return 800;
      case 1:
        return 500;
      case 2:
        return 300;
    }
  };

  const saveData = async () => {
    try {
      const lastBestScore = await AsyncStorage.getItem(route.params.username);
      if (lastBestScore === null || parseInt(lastBestScore) < pointsValue) {
        await AsyncStorage.setItem(route.params.username, pointsValue.toString());
      }
    } catch (error) {}
  };

  const initializeGame = () => {
    setGameState(GameState.starting);
    setPointsValue(0);
    setAttempts(20);
    setTimer(3);
  };

  const startGame = () => {
    initializeGame();

    const interval = setInterval(() => {
      setTimer((prevValue) => prevValue - 1);
    }, 1000);
    intervalRef.current = interval;
  };

  const setGameTimer = () => {
    // Difficulty

    const interval = setInterval(() => {
      let randomId = Math.floor(Math.random() * 9);
      setActiveId(randomId);

      setTimeout(() => {
        setActiveId(-1);
        setAttempts((prevValue) => prevValue - 1);
      }, difficultyToMs());
    }, 2000);
    intervalRef.current = interval;
  };

  const generateButtons = (rowNum) => {
    let buttons = [];
    for (let i = 0; i < 3; i++) {
      let buttonId = i + rowNum * 3;
      buttons.push(
        <TouchableWithoutFeedback
          key={i}
          onPress={() => {
            if (gameState === GameState.ongoing) {
              if (activeId === buttonId) {
                setPointsValue(pointsValue + (route.params.difficulty + 1));
                setActiveId(-1);
              } else {
                setPointsValue(pointsValue - 1);
              }
            }
          }}
        >
          <View>
            <TrainingButton theme={route.params.theme} active={activeId === buttonId} />
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return buttons;
  };

  const trainingGround = [];
  trainingGround.push(
    <View key={12} style={{ ...styles.trainingArea, marginTop: 40 }}>
      {generateButtons(0)}
    </View>
  );
  for (let i = 1; i < 3; i++) {
    trainingGround.push(
      <View key={i} style={{ ...styles.trainingArea }}>
        {generateButtons(i)}
      </View>
    );
  }

  return (
    <View>
      <Appbar style={styles.appBar}>
        <Appbar.Action
          icon={() => <MaterialIcons name="arrow-back" size={23} color="#fff" />}
          onPress={() => {
            navigation.goBack();
          }}
          animated={false}
        />
        <Appbar.Content title="Reaction Training App" color="#fff" />
      </Appbar>
      <View style={styles.content}>
        <Text style={{ ...styles.text, marginTop: 5 }}>{gameState}</Text>
        <Text style={styles.text}>{gameState === GameState.starting ? timer : pointsValue}</Text>

        {trainingGround}
        {gameState === GameState.finished && (
          <Button
            style={{
              height: 40,
              justifyContent: "center",
              marginTop: 20,
            }}
            color={colors.green_500}
            labelStyle={{ color: "whitesmoke" }}
            mode="contained"
            onPress={startGame}
          >
            Play Again!
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appBar: {
    position: "relative",
    left: 0,
    right: 0,
    top: StatusBar.currentHeight,
    backgroundColor: colors.green_500,
    marginBottom: 30,
  },
  content: {
    alignItems: "center",
  },
  text: {
    fontSize: 28,
  },
  trainingArea: {
    flexDirection: "row",
  },
});

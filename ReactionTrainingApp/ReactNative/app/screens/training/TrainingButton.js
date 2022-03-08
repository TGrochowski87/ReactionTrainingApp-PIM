import React from "react";
import { StyleSheet, View } from "react-native";

export default function TrainingButton({ theme, active }) {
  return <View style={{ ...styles.trainingButton, backgroundColor: active ? theme.active : theme.inactive }}></View>;
}

const styles = StyleSheet.create({
  trainingButton: {
    width: 110,
    height: 110,
    margin: 8,
    borderColor: "black",
    borderWidth: 2,
  },
});

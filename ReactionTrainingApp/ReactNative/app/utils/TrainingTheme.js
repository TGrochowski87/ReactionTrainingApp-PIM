import React from "react";
import { StyleSheet, View } from "react-native";
import { useState } from "react/cjs/react.development";

import colors from "../config/colors";

export default TrainingTheme = ({ active, inactive, isSelected }) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  return (
    <View
      style={{
        flex: 1,
        margin: isSelected ? 6 : 8,
        padding: isSelected ? 3 : 1,
        backgroundColor: isSelected ? colors.blue_500 : "black",
      }}
    >
      <View
        onLayout={(event) => {
          let { width, height } = event.nativeEvent.layout;
          setX(width);
          setY(height);
        }}
        style={{
          flex: 1,
          borderTopColor: active,
          borderRightColor: inactive,
          borderTopWidth: x,
          borderRightWidth: y,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  theme: {
    borderTopWidth: 50,
    borderRightWidth: 50,
  },
});

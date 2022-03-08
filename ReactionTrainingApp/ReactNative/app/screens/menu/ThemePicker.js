import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";

import colors from "../../config/colors";
import TrainingTheme from "../../utils/TrainingTheme";

export default function ThemePicker({ selectedTheme, setSelectedTheme }) {
  const [themes] = useState([
    {
      id: 0,
      active: colors.green_500,
      inactive: colors.red_500,
    },
    {
      id: 1,
      active: colors.blue_700,
      inactive: colors.yellow_700,
    },
    {
      id: 2,
      active: colors.pink_300,
      inactive: colors.purple_800,
    },
    {
      id: 3,
      active: colors.blue_400,
      inactive: colors.pink_300,
    },
    {
      id: 4,
      active: colors.yellow_700,
      inactive: colors.purple_800,
    },
  ]);

  useEffect(() => {
    setSelectedTheme(themes[0]);
  }, []);

  return (
    <View style={styles.themeGrid}>
      {themes.map((theme) => (
        <TouchableWithoutFeedback
          key={theme.id}
          onPress={() => {
            setSelectedTheme(theme);
          }}
        >
          <View>
            <TrainingTheme
              active={theme.active}
              inactive={theme.inactive}
              isSelected={selectedTheme.id === theme.id}
            />
          </View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  themeGrid: {
    height: 75,
    width: 375,
    flexDirection: "row",
  },
});

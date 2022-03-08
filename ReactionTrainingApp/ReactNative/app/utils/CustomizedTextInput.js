import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-paper";

import colors from "../config/colors";

export default CustomizedTextInput = ({ value, setValue }) => {
  return (
    <View style={styles.inputLayout}>
      <TextInput
        theme={{ colors: { primary: colors.grey_700 } }}
        style={{fontSize: 18}}
        mode="outlined"
        label="Your Name"
        placeholder="Anonymous"
        value={value}
        onChangeText={(text) => setValue(text)}
        maxLength={20}
      />
      <Text style={styles.counterText}>{`${value.length}/20`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  inputLayout: {
    width: 300
  },
  counterText: {
    textAlign: "right",
  },
});

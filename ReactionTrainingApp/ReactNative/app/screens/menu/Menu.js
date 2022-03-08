import React, { useState } from "react";
import { useEffect, useRef } from "react/cjs/react.development";
import { StyleSheet, View, StatusBar, Text, DrawerLayoutAndroid } from "react-native";
import { Appbar, Button, Dialog, Paragraph, Portal, Provider } from "react-native-paper";
import { MaterialIcons } from "react-native-vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

import colors from "../../config/colors";

import CustomizedTextInput from "../../utils/CustomizedTextInput";
import ThemePicker from "./ThemePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Menu({ navigation }) {
  const drawerRef = useRef(null);
  const [username, setUsername] = useState("");
  const [labelText, setLabelText] = useState("");
  const [difficulty, setDifficulty] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState({});
  const [showAbout, setShowAbout] = useState(false);
  const [leaders, setLeaders] = useState([
    {
      name: "NoData",
      score: 0,
    },
    {
      name: "NoData",
      score: 0,
    },
    {
      name: "NoData",
      score: 0,
    },
  ]);
  const [leaderboardColors] = useState([colors.amber_800, colors.grey_700, colors.brown_600]);

  const labels = ["EASY\nTime to click: 800 ms", "MEDIUM\nTime to click: 500 ms", "HARD\nTime to click: 300 ms"];
  const about = `
  Game starts after a short countdown.

  Tap the glowing square as fast as you
  can to get the points.
  The higher difficulty you choose, the
  more points you get!
  Any missclicks will cost you 1 point
  
  Game ends after 20 attempts.
  The fastest and most precise players
  will be featured on the leaderboard.
  `;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLeaders([
      {
        name: "NoData",
        score: 0,
      },
      {
        name: "NoData",
        score: 0,
      },
      {
        name: "NoData",
        score: 0,
      },
    ]);
    const keys = await AsyncStorage.getAllKeys();

    let leaderboardData = [];
    for (let key of keys) {
      const score = await AsyncStorage.getItem(key);
      leaderboardData.push({
        name: key,
        score: parseInt(score),
      });
    }
    leaderboardData.push(...leaders);
    leaderboardData.sort((a, b) => (a.score > b.score ? -1 : 1));

    setLeaders(leaderboardData.slice(0, 3));
  };

  const drawerContent = () => (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerTitle}>
        <Text style={{ fontSize: 30, fontWeight: "bold", marginTop: 20, marginLeft: 15 }}>
          Leaderboard {`\u{1f396}`}
        </Text>
      </View>
      <View>
        {leaders.map((leader, index) => (
          <View key={index} style={styles.leaderBlock}>
            <MaterialIcons name="emoji-events" size={23} color={leaderboardColors[index]} />
            <View style={styles.leaderData}>
              <Text>{leader.name}</Text>
              <Text style={{ color: colors.grey_700 }}>{leader.score}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <DrawerLayoutAndroid ref={drawerRef} drawerWidth={300} drawerPosition="left" renderNavigationView={drawerContent}>
      <Provider>
        <View style={styles.window}>
          <Appbar style={styles.appBar}>
            <Appbar.Action
              icon={() => <MaterialIcons name="leaderboard" size={23} color="#fff" />}
              onPress={() => drawerRef.current.openDrawer()}
              animated={false}
            />
            <Appbar.Content title="Reaction Training App" color="#fff" />
          </Appbar>
          <Portal>
            <Dialog
              visible={showAbout}
              onDismiss={() => {
                setShowAbout(false);
              }}
            >
              <Dialog.Title>About</Dialog.Title>
              <Dialog.Content>
                <Paragraph>{about}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => {
                    setShowAbout(false);
                  }}
                >
                  Ok
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <View style={styles.contentView}>
            <CustomizedTextInput value={username} setValue={setUsername} />
            <Text style={{ fontSize: 18, marginTop: 40 }}>Choose game difficulty</Text>
            <MultiSlider
              trackStyle={{ backgroundColor: colors.green_100 }}
              selectedStyle={{ backgroundColor: colors.green_500 }}
              markerStyle={{ backgroundColor: colors.green_500 }}
              min={0}
              max={2}
              step={1}
              snapped={true}
              enableLabel={true}
              showSteps={true}
              onValuesChange={(values) => {
                setLabelText(labels[values]);
                setDifficulty(values[0]);
              }}
              onValuesChangeFinish={() => {
                setLabelText("");
              }}
              customLabel={(sliderPosition) => (
                <View
                  style={{
                    backgroundColor: "lightgrey",
                    position: "absolute",
                    left: sliderPosition.oneMarkerLeftPosition - (sliderPosition.oneMarkerValue + 1) * 30,
                    bottom: 50,
                  }}
                >
                  <Text>{labelText}</Text>
                </View>
              )}
            />
            <Text style={{ fontSize: 18, marginTop: 40 }}>Select game theme</Text>
            <ThemePicker selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />
            <View style={styles.buttonSpace}>
              <Button
                style={{
                  height: 50,
                  justifyContent: "center",
                }}
                color={colors.green_500}
                labelStyle={{ color: "whitesmoke" }}
                mode="contained"
                onPress={() => {
                  navigation.navigate("Training", {
                    theme: selectedTheme,
                    username: username.trim() !== "" ? username : "Anonymous",
                    difficulty: difficulty,
                  });
                }}
              >
                TRAIN YOUR REACTION
              </Button>
              <View style={styles.lowerButtons}>
                <Button
                  style={{
                    width: "48%",
                    height: 50,
                    justifyContent: "center",
                  }}
                  color={colors.green_500}
                  mode="contained"
                  onPress={() => drawerRef.current.openDrawer()}
                >
                  <MaterialIcons name="leaderboard" size={23} color="#fff" />
                </Button>
                <Button
                  style={{
                    width: "48%",
                    justifyContent: "center",
                  }}
                  color={colors.green_500}
                  labelStyle={{ fontSize: 24, color: "whitesmoke" }}
                  mode="contained"
                  onPress={() => {
                    setShowAbout(true);
                  }}
                >
                  ?
                </Button>
              </View>
            </View>
          </View>
        </View>
      </Provider>
    </DrawerLayoutAndroid>
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
  buttonSpace: {
    width: "73%",
    marginTop: 70,
  },
  contentView: {
    position: "absolute",
    flexDirection: "column",
    width: "100%",
    top: 100,
    alignItems: "center",
    paddingHorizontal: 30,
  },
  drawerContainer: {
    flex: 1,
  },
  drawerTitle: {
    height: "25%",
    width: "100%",
    backgroundColor: colors.green_500,
  },
  leaderBlock: {
    height: 100,
    width: "100%",
    padding: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  leaderData: {
    flexDirection: "column",
    marginLeft: 30,
  },
  lowerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  window: {
    flex: 1,
    backgroundColor: colors.grey_300,
  },
});

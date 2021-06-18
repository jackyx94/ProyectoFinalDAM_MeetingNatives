import React from "react";
import { StyleSheet, View } from "react-native";

export default function HorizontalSeparator(props) {
  return <View style={styles.horizontalLine}></View>;
}

const styles = StyleSheet.create({
  horizontalLine: {
    minWidth: "100%",
    borderColor: "#e3e3e3",
    borderBottomWidth: 2,
    marginTop: 10,
    paddingBottom: 10,
  },
});

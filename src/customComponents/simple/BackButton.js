import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Icon from "react-native-vector-icons/FontAwesome";

export default function BackButton({ goBack, color = "#696969" }) {
  return (
    <TouchableOpacity onPress={goBack} style={styles.container}>
      {/* <Image
        style={styles.image}
        source={require("../assets/arrow_back.png")}
      /> */}
      <Icon color={color} size={24} name="arrow-left" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10 + getStatusBarHeight(),
    left: 4,
  },
  // icon: {
  //   width: 44,
  //   height: 44,
  // },
});

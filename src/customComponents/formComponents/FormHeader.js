import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { BackButton } from "../../customComponents";

export default function FormHeader(navigation) {
  return (
    <View>
      <View style={styles.header}>
        <View>
          <BackButton goBack={navigation.goBack} color="white"></BackButton>
        </View>
      </View>
      <Image
        style={styles.avatar}
        source={require("../../assets/womanAvatar.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: 14,
    backgroundColor: "#0A75F2",
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 130,
  },
});

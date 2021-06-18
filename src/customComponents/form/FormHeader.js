import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { BackButton } from "../../customComponents";
import { useNavigation } from "@react-navigation/native";
import womanAvatar from "../../assets/womanAvatar.png";

export default function FormHeader() {
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.header}>
        <View>
          <BackButton goBack={navigation.goBack} color="white"></BackButton>
        </View>
      </View>
      <Image style={styles.avatar} source={womanAvatar} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: 14,
    backgroundColor: "#0A75F2",
    height: 160,
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
    marginTop: 80,
  },
});

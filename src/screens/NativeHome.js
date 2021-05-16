import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
//Import AwesomeIcon from "react-native-vector-icons";

export default function NativeHome({ navigation }) {
  return (
    <View>
      <View style={styles.body}>
        <View style={styles.cardComponent}>
          <View style={styles.activityImageContainer}>
            <Image
              style={styles.activityImage}
              source={{ uri: "https://picsum.photos/200/300" }}
            ></Image>
          </View>
          <View style={styles.activityContent}>
            <View styles={styles.cardDescriptionContainer}>
              <Text style={styles.cardTitles}>Descripción</Text>
              <Text
                numberOfLines={6}
                ellipsizeMode="tail"
                style={styles.cardText}
              >
                Virtute equidem ceteros in mel. Id volutpat neglegentur eos. Eu
                eum facilisis voluptatum, no eam albucius verterem. Sit congue
                platonem adolescens ut. Offendit reprimique et has, eu mei
                homero imperdiet. At cum soleat disputationi, quo veri admodum
                vituperata ad. SSEa vix ceteros complectitur, vel cu nihil
                nullam. Nam placerat oporteat molestiae ei, an putant albucius
                qui. Oblique menandri ei his, mei te mazim oportere
                comprehensam.
              </Text>
            </View>
            <View style={styles.cardDataContainer}>
              <View style={styles.extraData}>
                <Text style={styles.cardTitles}>Duración</Text>
                <Text style={styles.cardText}> de 2 a 4 horas</Text>
              </View>
              <View style={styles.extraData}>
                <Text style={styles.cardTitles}>Participantes</Text>
                <Text style={styles.cardText}> entre 1 y 6</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.cardComponent}>
          <View style={styles.activityImageContainer}>
            <Image
              style={styles.activityImage}
              source={{ uri: "https://picsum.photos/200/300" }}
            ></Image>
          </View>
          <View style={styles.activityContent}>
            <View styles={styles.cardDescriptionContainer}>
              <Text style={styles.cardTitles}>Descripción</Text>
              <Text
                numberOfLines={6}
                ellipsizeMode="tail"
                style={styles.cardText}
              >
                Virtute equidem ceteros in mel. Id volutpat neglegentur eos. Eu
                eum facilisis voluptatum, no eam albucius verterem. Sit congue
                platonem adolescens ut. Offendit reprimique et has, eu mei
                homero imperdiet. At cum soleat disputationi, quo veri admodum
                vituperata ad. SSEa vix ceteros complectitur, vel cu nihil
                nullam. Nam placerat oporteat molestiae ei, an putant albucius
                qui. Oblique menandri ei his, mei te mazim oportere
                comprehensam.
              </Text>
            </View>
            <View style={styles.cardDataContainer}>
              <View style={styles.extraData}>
                <Text style={styles.cardTitles}>Duración</Text>
                <Text style={styles.cardText}> de 2 a 4 horas</Text>
              </View>
              <View style={styles.extraData}>
                <Text style={styles.cardTitles}>Participantes</Text>
                <Text style={styles.cardText}> entre 1 y 6</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.cardComponent}>
          <View style={styles.activityImageContainer}>
            <Image
              style={styles.activityImage}
              source={{ uri: "https://picsum.photos/200/300" }}
            ></Image>
          </View>
          <View style={styles.activityContent}>
            <View styles={styles.cardDescriptionContainer}>
              <Text style={styles.cardTitles}>Descripción</Text>
              <Text
                numberOfLines={6}
                ellipsizeMode="tail"
                style={styles.cardText}
              >
                Virtute equidem ceteros in mel. Id volutpat neglegentur eos. Eu
                eum facilisis voluptatum, no eam albucius verterem. Sit congue
                platonem adolescens ut. Offendit reprimique et has, eu mei
                homero imperdiet. At cum soleat disputationi, quo veri admodum
                vituperata ad. SSEa vix ceteros complectitur, vel cu nihil
                nullam. Nam placerat oporteat molestiae ei, an putant albucius
                qui. Oblique menandri ei his, mei te mazim oportere
                comprehensam.
              </Text>
            </View>
            <View style={styles.cardDataContainer}>
              <View style={styles.extraData}>
                <Text style={styles.cardTitles}>Duración</Text>
                <Text style={styles.cardText}> de 2 a 4 horas</Text>
              </View>
              <View style={styles.extraData}>
                <Text style={styles.cardTitles}>Participantes</Text>
                <Text style={styles.cardText}> entre 1 y 6</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.cardComponent}>
          <View style={styles.activityImageContainer}>
            <Image
              style={styles.activityImage}
              source={{ uri: "https://picsum.photos/200/300" }}
            ></Image>
          </View>
          <View style={styles.activityContent}>
            <View styles={styles.cardDescriptionContainer}>
              <Text style={styles.cardTitles}>Descripción</Text>
              <Text
                numberOfLines={6}
                ellipsizeMode="tail"
                style={styles.cardText}
              >
                Virtute equidem ceteros in mel. Id volutpat neglegentur eos. Eu
                eum facilisis voluptatum, no eam albucius verterem. Sit congue
                platonem adolescens ut. Offendit reprimique et has, eu mei
                homero imperdiet. At cum soleat disputationi, quo veri admodum
                vituperata ad. SSEa vix ceteros complectitur, vel cu nihil
                nullam. Nam placerat oporteat molestiae ei, an putant albucius
                qui. Oblique menandri ei his, mei te mazim oportere
                comprehensam.
              </Text>
            </View>
            <View style={styles.cardDataContainer}>
              <View style={styles.extraData}>
                <Text style={styles.cardTitles}>Duración</Text>
                <Text style={styles.cardText}> de 2 a 4 horas</Text>
              </View>
              <View style={styles.extraData}>
                <Text style={styles.cardTitles}>Participantes</Text>
                <Text style={styles.cardText}> entre 1 y 6</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.cardComponent}></View>
        <View style={styles.cardComponent}></View>
        <View style={styles.cardComponent}></View>
      </View>
      <View style={styles.addActivityContainer}>
        <TouchableOpacity onPress={() => {}} style={styles.addActivityButton}>
          <Icon name="plus" size={40} color="#707070"></Icon>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  extraData: {
    marginRight: 10,
  },
  cardDescriptionContainer: {
    flex: 4,
  },
  cardDataContainer: {
    flex: 1,
  },
  cardDataContainer: {
    justifyContent: "center",
    marginTop: 10,
    flexDirection: "row",
  },
  cardTitles: {
    alignSelf: "center",
    fontSize: 14,
    color: "#696969",
  },
  cardText: {
    fontSize: 11,
    color: "#696969",
  },
  activityImage: {
    flex: 1,
    backgroundColor: "white",
  },
  activityImageContainer: {
    flex: 1,
    backgroundColor: "#BCBCBC",
  },
  activityImageContainer2: {
    flex: 1,
    backgroundColor: "#BCBCBC",
  },
  activityContent: {
    padding: 10,
    flex: 2,
    backgroundColor: "white",
  },
  cardComponent: {
    flexDirection: "row",
    backgroundColor: "#BCBCBC",
    height: 200,
    marginBottom: 10,
  },
  body: {
    // paddingTop: 10,
    // paddingHorizontal: 10,
    flex: 1,
  },
  addActivityContainer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "transparent",
    marginBottom: "10%",
    marginRight: "24%",
    width: "100%",
  },
  addActivityButton: {
    alignSelf: "flex-end",
  },
  name: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#696969",
  },
});

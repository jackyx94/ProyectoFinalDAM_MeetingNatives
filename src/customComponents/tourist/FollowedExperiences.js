import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import firebase from "firebase";
import ExperienceCard from "../shared/ExperienceCard";

export default function FollowedExperiences({ navigation }) {
  const [followedRetrieved, setFollowed] = useState([]);
  const [refreshFollowed, setRefreshFollowed] = useState(false);
  useEffect(() => {
    setFollowed([]);
    retrieveFollowedExperiences();
  }, [refreshFollowed]);

  async function retrieveFollowedExperiences() {
    var user = firebase.auth().currentUser;
    const dbSt = firebase.firestore();
    const followedRefs = dbSt.collection("users").doc(user.email.toString());
    const singleFollowed = dbSt.collection("sharedData");
    //var auxArray = [];
    followedRefs
      .get("followedExperiencesId")
      .then((doc) => {
        if (doc.exists) {
          doc.data().followedExperiencesId.forEach((id) => {
            singleFollowed
              .doc(id)
              .get()
              .then((doc) => {
                setFollowed((oldArray) => [...oldArray, [doc.data(), id]]);
              });
          });
        } else {
          console.log("No se ha encontrado el documento!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
    //setFollowed(auxArray);
  }
  function manageContent() {
    if (followedRetrieved.length > 0) {
      var experiences = followedRetrieved.map((item) => {
        //console.log("checking id " + item[1]);
        return (
          <ExperienceCard
            key={item[1]}
            data={item}
            parent={"touristFollowed"}
            refreshFollowed={setRefreshFollowed}
          ></ExperienceCard>
        );
      });
      return <View>{experiences}</View>;
    }
  }
  return (
    <View>
      <Text style={styles.headerText}>Lista de intereses</Text>
      <View style={styles.horizontalLine}></View>
      {manageContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    marginTop: 12,
    fontSize: 18,
    color: "#696969",
    alignSelf: "center",
  },
  horizontalLine: {
    borderColor: "#e3e3e3",
    borderBottomWidth: 2,
    marginHorizontal: 10,
    marginTop: 10,
    paddingBottom: 10,
  },
});

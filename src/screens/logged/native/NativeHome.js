import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import firebase from "firebase";
import ExperienceCard from "../../../customComponents/shared/ExperienceCard";
import ChatRooms from "../../../customComponents/interaction/ChatRooms";

export default function NativeHome({
  scrollEnd,
  currentNativeContent,
  setNativeContent,
  handleContentState,
}) {
  const [userExperiences, setUserExperiences] = useState([]);
  const [currentContent, setCurrentContent] = useState("myExperiences");
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    manageContent();
  }, [refresh]);

  useEffect(() => {
    retrieveMyExperiences();
  }, []);
  useEffect(() => {
    if (currentContent != currentNativeContent) {
      setCurrentContent(currentNativeContent);
    }
    setRefresh((previus) => !previus);
  }, [currentNativeContent]);
  useEffect(() => {
    //mandamos el estado de los chips al componente padre para gestionar
    // allí los datos del formulario cada vez que se actualice la variable de estado items
    returnState();
  }, [currentContent]);

  function returnState() {
    return handleContentState(currentContent);
  }
  //funcion que obtiene las experiencias del usuario nativo de firebase
  async function retrieveMyExperiences() {
    var user = firebase.auth().currentUser;
    const dbSt = firebase.firestore();
    const experiencesRef = dbSt.collection("sharedData");

    const snapshot = await experiencesRef
      .where("creatorUser", "==", user.email)
      .get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return;
    }
    snapshot.forEach((doc) => {
      setUserExperiences((oldArray) => [...oldArray, [doc.data(), doc.id]]);
    });
  }
  //funcion para mostrar mis experiencias
  function showMyExperiences() {
    return (
      <View style={styles.body}>
        <Text style={styles.headerText}>Mis experiencias</Text>
        <View style={styles.horizontalLine}></View>
        {userExperiences.map(function (item) {
          return <ExperienceCard data={item} parent="native"></ExperienceCard>;
        })}
      </View>
    );
  }
  const chatStateHandler = (data) => {
    setCurrentContent(data);
  };
  //funcion que maneja el contenido actual de la interfaz
  function manageContent() {
    switch (currentContent) {
      case "myExperiences":
        return showMyExperiences();
      case "chatRooms":
        return (
          <ChatRooms
            setNativeContent={setNativeContent}
            parent={"nativeMail"}
            handleChatState={chatStateHandler}
            scrollEnd={scrollEnd}
          ></ChatRooms>
        );
      case "talking":
        return (
          <ChatRooms
            setNativeContent={setNativeContent}
            parent={"nativeMail"}
            handleChatState={chatStateHandler}
            scrollEnd={scrollEnd}
          ></ChatRooms>
        );
    }
  }
  return manageContent();
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
  body: {
    width: "100%",
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#696969",
  },
});

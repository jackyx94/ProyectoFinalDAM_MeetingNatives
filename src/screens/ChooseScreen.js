import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import BackgroundSign from "../customComponents/Background";
import Logo from "../customComponents/Logo";
import Header from "../customComponents/Header";
import Button from "../customComponents/Button";
import BackButton from "../customComponents/BackButton";
import firebase from "firebase";
import admin from "firebase";
//import * as auth from "@firebase/auth";

export default function ChooseScreen({ navigation }) {
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [uid, setUid] = useState({ value: "", error: "" });

  const onChoosing = () => {
    var user = firebase.auth().currentUser;
    var name, email, uid;
    console.log("dentroshowdata");
    if (user != null) {
      console.log("user loggeado" + user.email);
      email = user.email;
      setEmail({ value: user.email, error: "" });
      console.log("valor email despues settear " + email.value);
      uid = user.uid;
      setUid({ value: user.uid, error: "" });
    }
    retrieveData();
  };
  function retrieveData() {
    //var admin = require("firebase-admin");
    // Get a database reference to our posts
    var db = admin.database();
    var ref = db.ref("users/usuariastro");
    // Attach an asynchronous callback to read the data at our posts reference
    ref.on(
      "value",
      function (snapshot) {
        console.log(snapshot.val());
      },
      function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      }
    );
  }

  return (
    <BackgroundSign>
      {/* <BackButton goBack={navigation.goBack} /> */}
      <Logo />
      <Text>¿Con que perfil de usuario quieres empezar?</Text>

      <Button
        mode="contained"
        onPress={() => onChoosing()}
        style={{ marginTop: 24 }}
      >
        Autoctono
      </Button>
      <Button
        mode="contained"
        onPress={() => onChoosing()}
        style={{ marginTop: 24 }}
      >
        Visitante
      </Button>
    </BackgroundSign>
  );
}
const styles = StyleSheet.create({
  // row: {
  //   flexDirection: "row",
  //   marginTop: 4,
  // },
});

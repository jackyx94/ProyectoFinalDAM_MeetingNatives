import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import {
  Background,
  Logo,
  Header,
  Button,
  TextInput,
  BackButton,
} from "../customComponents";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { stringValidator } from "../helpers/stringValidator";
import firebase from "firebase";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const onSignUpPressed = () => {
    const nameError = stringValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    } else {
      //llamamos a la funciones que crean tanto la referencia de autenticación como
      //la de los datos agregados que se gestionan en tiempo real si la validación
      //es correcta
      createAuth();
      createDataRef();
    }
  };
  async function createDataRef() {
    var unSuscribe = firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        createFirestoreDocument(user);
        unSuscribe();
      } else {
        // no hacemos nada, esperamos a a que el observador StateChanged detecte el login
        // creamos el nodo en realtimedb y dejamos de observar(stateChanged devuelve la funcion
        // unsuscribe)
      }
    });
  }
  async function createFirestoreDocument(user) {
    const dbFire = firebase.firestore();
    const newUserDocument = await dbFire
      .collection("users")
      .doc(user.email)
      .set({
        name: name.value,
        uid: user.uid,
        currentProfile: "",
      });
  }
  function createAuth() {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email.value, password.value)
      .then(() => {
        console.log("Cuenta creada y loggeada");
        navigation.reset({
          index: 0,
          routes: [{ name: "ChooseScreen" }],
        });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setEmail({ ...email, error: "El email ya está en uso" });
          console.log("El email ya está en uso");
        }
        if (error.code === "auth/invalid-email") {
          console.log("Formato de email no válido");
        }
        console.error(error);
      });
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Registro</Header>
      <TextInput
        label="Nombre"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: "" })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Contraseña"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={() => onSignUpPressed()}
        style={{ marginTop: 24 }}
      >
        Crear cuenta
      </Button>
      <View style={styles.row}>
        <Text>¿Ya tienes una cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
          <Text style={styles.link}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: "#0A75F2",
  },
});

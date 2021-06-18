import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import {
  Background,
  Logo,
  Header,
  Button,
  TextInput,
  BackButton,
} from "../customComponents";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import firebase from "firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  useEffect(() => {
    //Nos aseguramos de que no haya una sesión activa antes de iniciar una nueva
    var unSuscribe = firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase
          .auth()
          .signOut()
          .then(() => {
            console.log("Sign-out successful");
          })
          .catch((error) => {
            console.log("Sign-out error");
          });
      }
    });
    unSuscribe();
  }, []);

  const onLoginPressed = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    } else {
      singingIn(email.value, password.value);
    }
  };

  const singingIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then((userCredential) => {
        var user = userCredential.user;
        if (user) {
          const dbSt = firebase.firestore();
          const experiencesRef = dbSt.collection("users").doc(user.email);
          experiencesRef
            .get()
            .then((doc) => {
              if (doc.data().currentProfile === "native") {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "SideMenuContainer" }],
                });
                return;
              } else {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "SideMenuContainer" }],
                });
              }
              return;
            })
            .catch((error) => {
              console.error("El usuario no tiene perfil establecido", error);
              navigation.reset({
                index: 0,
                routes: [{ name: "ChooseScreen" }],
              });
            });
        } else {
          console.log("No se ha encontrado usuario logueado");
        }
      })
      .catch((error) => {
        console.log("LogError: " + error.message + "_Code: " + error.code);
        var errorCode = error.code;
        if (errorCode === "auth/wrong-password") {
          setPassword({ ...password, error: "Contraseña incorrecta" });
        } else if (errorCode === "auth/user-not-found") {
          setEmail({ ...email, error: "Este email no tiene cuenta asociada" });
        }
      });
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Bienvenido de nuevo.</Header>
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
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ResetPasswordScreen")}
        >
          <Text style={styles.forgot}>¿Has olvidado tu contraseña?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>¿No tienes cuenta aún? </Text>
        <TouchableOpacity onPress={() => navigation.replace("RegisterScreen")}>
          <Text style={styles.link}>Crear cuenta</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: "#0A75F2",
  },
});

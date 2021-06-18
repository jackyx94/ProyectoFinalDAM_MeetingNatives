import React, { useEffect } from "react";
import {
  Background,
  Logo,
  Header,
  Button,
  Paragraph,
} from "../customComponents";
import initializeFirebase from "../databases/firebaseActions";

export default function StartScreen({ navigation }) {
  useEffect(() => {
    initializeFirebase();
  }, []);

  return (
    <Background>
      <Logo />
      <Header>MeetingNatives</Header>
      <Paragraph>
        Bienvenido a la mejor aplicación para vivir experiencias auténticas
        mientras viajas.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("LoginScreen")}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        Crear cuenta
      </Button>
    </Background>
  );
}

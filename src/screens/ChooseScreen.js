import React from "react";
import { Text } from "react-native";
import BackgroundSign from "../customComponents/simple/Background";
import Logo from "../customComponents/simple/Logo";
import Button from "../customComponents/simple/Button";

export default function ChooseScreen({ navigation }) {
  return (
    <BackgroundSign>
      <Logo />
      <Text>¿Con que perfil de usuario quieres empezar?</Text>

      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate("NativeForm", {
            languages: null,
            livingPlace: null,
          });
        }}
        style={{ marginTop: 24 }}
      >
        Autoctono
      </Button>
      <Button
        mode="contained"
        onPress={() => {
          navigation.navigate("TouristForm", { categories: null });
        }}
        style={{ marginTop: 24 }}
      >
        Visitante
      </Button>
    </BackgroundSign>
  );
}

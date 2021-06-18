import React from "react";
import BackgroundSign from "../customComponents/simple/Background";
import Logo from "../customComponents/simple/Logo";
import Header from "../customComponents/simple/Header";
import { Paragraph } from "../customComponents";
import Button from "../customComponents/simple/Button";

export default function Dashboard({ navigation }) {
  return (
    <BackgroundSign>
      <Logo />
      <Header></Header>
      <Paragraph></Paragraph>
      <Button
        mode="outlined"
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "StartScreen" }],
          })
        }
      >
        Logout
      </Button>
    </BackgroundSign>
  );
}

import React from "react";
import BackgroundSign from "../customComponents/Background";
import Logo from "../customComponents/Logo";
import Header from "../customComponents/Header";
import Paragraph from "../customComponents/Paragraph";
import Button from "../customComponents/Button";

export default function Dashboard({ navigation }) {
  return (
    <BackgroundSign>
      <Logo />
      <Header>Let’s start</Header>
      <Paragraph>
        Your amazing app starts here. Open you favorite code editor and start
        editing this project.
      </Paragraph>
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

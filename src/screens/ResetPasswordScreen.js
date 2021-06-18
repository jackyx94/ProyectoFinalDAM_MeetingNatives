import React, { useState } from "react";
import BackgroundSign from "../customComponents/simple/Background";
import BackButton from "../customComponents/simple/BackButton";
import Logo from "../customComponents/simple/Logo";
import Header from "../customComponents/simple/Header";
import TextInput from "../customComponents/simple/TextInput";
import Button from "../customComponents/simple/Button";
import { emailValidator } from "../helpers/emailValidator";
import firebase from "firebase";
export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });

  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    firebase
      .auth()
      .sendPasswordResetEmail(email.value)
      .then(function (user) {
        alert("Email de restauración enviado");
      })
      .catch(function (e) {
        console.log(e);
      });
    navigation.navigate("LoginScreen");
  };

  return (
    <BackgroundSign>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Restaurar contraseña</Header>
      <TextInput
        label="E-mail de la cuenta"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="Recibirás un mail con el link de restauración."
      />
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
        Enviar instrucciones
      </Button>
    </BackgroundSign>
  );
}

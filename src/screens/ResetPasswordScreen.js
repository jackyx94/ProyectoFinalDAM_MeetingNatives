import React, { useState } from "react";
import BackgroundSign from "../customComponents/Background";
import BackButton from "../customComponents/BackButton";
import Logo from "../customComponents/Logo";
import Header from "../customComponents/Header";
import TextInput from "../customComponents/TextInput";
import Button from "../customComponents/Button";
import { emailValidator } from "../helpers/emailValidator";

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });

  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }
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

import React, { useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { Text, RadioButton } from "react-native-paper";
import { Button, TextInput } from "../../../customComponents";
import InputSpinner from "react-native-input-spinner";
import { Chip } from "react-native-paper";
import { FormHeader } from "../../../customComponents/formComponents";

export default function TouristProfile({ navigation }) {
  const [checked, setChecked] = useState("si");
  const [city, setCity] = useState("");
  const [newLang, setNewLang] = useState("");
  const [description, setDescription] = useState("");
  const [yearsLived, setYearsLived] = useState(1);
  const [intereses, setIntereses] = useState([
    { interes: "Aventura", checked: false },
    { interes: "Relax", checked: false },
    { interes: "Playa", checked: false },
    { interes: "Montaña", checked: false },
    { interes: "Cultura", checked: false },
    { interes: "Entretenimiento", checked: false },
  ]);
  const showSpinner = () => {
    if (checked === "no") {
      return (
        <View style={styles.spinnerContainer}>
          <Text style={styles.questions}>
            ¿Con cuantas personas sueles viajar?
          </Text>
          <InputSpinner
            style={styles.margins}
            max={99}
            min={1}
            step={1}
            color="#00BFFF"
            value={yearsLived}
            colorPress="#BCBCBC"
            fontSize={16}
            textColor="#696969"
            onChange={(yearsLived) => {
              setYearsLived(yearsLived);
            }}
          />
        </View>
      );
    }
  };
  const addInteres = () => {
    setIntereses((intereses) => [
      ...intereses,
      { interes: newLang, checked: true },
    ]);
  };
  const changeProfileImage = () => {};

  const manageChips = (text) => {
    console.log(text);
    var auxArray = intereses.map(function (item) {
      if (item.interes === text) {
        if (item.checked === false) {
          return { ...item, checked: true };
        } else {
          return { ...item, checked: false };
        }
      } else {
        return item;
      }
    });
    setIntereses(auxArray);
  };
  const showChips = () => {
    var chips = intereses.map(function (interes) {
      return (
        <Chip
          key={interes.interes}
          selected={interes.checked}
          style={styles.chipStyles}
          onPress={() => manageChips(interes.interes)}
        >
          {interes.interes}
        </Chip>
      );
    });
    return <View style={styles.chipContainer}>{chips}</View>;
  };
  return (
    <ScrollView style={styles.container}>
      {FormHeader(navigation)}
      <View style={styles.body}>
        <Text style={styles.name}>Completa tu perfil</Text>
        <TouchableOpacity onPress={changeProfileImage()}>
          <Text style={styles.link}>Cambiar imagen</Text>
        </TouchableOpacity>
        <TextInput
          label="¿De donde eres?"
          placeholder="Pais de origen"
          style={styles.inputs}
          onChangeText={(text) => setCity({ value: text, error: "" })}
        ></TextInput>
        <Text style={styles.questions}>¿Viajas solo?</Text>
        <View>
          <View style={styles.radioView}>
            <View style={styles.radioItem}>
              <Text style={styles.radioQuestion}>Si</Text>
              <RadioButton
                color="#00BFFF"
                value="yes"
                status={checked === "yes" ? "checked" : "unchecked"}
                onPress={() => setChecked("yes")}
              />
            </View>
            <View style={styles.radioItem}>
              <Text style={styles.radioQuestion}>No</Text>
              <RadioButton
                color="#00BFFF"
                value="no"
                status={checked === "no" ? "checked" : "unchecked"}
                onPress={() => setChecked("no")}
              />
            </View>
          </View>
        </View>
        {showSpinner()}
        <Text style={styles.questions}>
          Dinos cuales son tus principales intereses cuando viajas
        </Text>
        {showChips()}

        <Text style={styles.questions}>Otro:</Text>

        <View style={styles.addLangContainer}>
          <TextInput
            label="Añade otro interés"
            placeholder="Nuevo interés"
            onChangeText={(text) => setNewLang(text.toString())}
            style={styles.inputs}
          ></TextInput>
          <Button
            onPress={() => addInteres()}
            //style={styles.buttonAdd}
            //color="#00BFFF"
            mode="outlined"
          >
            Añadir
          </Button>
        </View>
        <Button mode="contained">Guardar perfil</Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addLangContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  link: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#0A75F2",
  },
  descriptionContainer: {
    width: "100%",
  },
  chipContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    justifyContent: "center",
  },
  chipStyles: {
    marginRight: 16,
    marginBottom: 10,
  },
  margins: {
    marginTop: 20,
  },
  spinnerContainer: {
    justifyContent: "center",
  },
  inputs: {
    marginTop: 10,
  },
  buttonSave: {
    marginTop: 30,
    color: "grey",
  },
  buttonAdd: {
    marginTop: 10,
    color: "grey",
    width: 120,
  },
  container: {
    flex: 1,
    width: "100%",
  },
  radioView: {
    alignItems: "center",
    flexDirection: "row",
  },
  radioItem: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 16,
  },
  questions: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 16,
    color: "#696969",
  },
  radioQuestion: {
    // fontSize: 16,
    color: "#696969",
  },
  body: {
    width: "100%",
    marginTop: 40,
    alignItems: "center",
    //alignSelf: "center",
    justifyContent: "center",
    padding: 30,
  },
  name: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#696969",
    //fontWeight: "600",
  },
});

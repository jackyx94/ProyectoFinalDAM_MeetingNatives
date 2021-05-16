import React, { useState } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { Text, RadioButton } from "react-native-paper";
import { Button, TextInput } from "../../../customComponents";
import InputSpinner from "react-native-input-spinner";
import { Chip } from "react-native-paper";
import { FormHeader } from "../../../customComponents/formComponents";

export default function NativeProfile({ navigation }) {
  const [checked, setChecked] = useState("si");
  const [city, setCity] = useState("");
  const [newLang, setNewLang] = useState("");
  const [description, setDescription] = useState("");
  const [yearsLived, setYearsLived] = useState(1);
  const [languages, setLanguages] = useState([
    { lengua: "Alemán", checked: false },
    { lengua: "Italiano", checked: false },
    { lengua: "Francés", checked: false },
    { lengua: "Español", checked: true },
    { lengua: "Chino", checked: false },
    { lengua: "Inglés", checked: false },
  ]);
  const showSpinner = () => {
    if (checked === "no") {
      return (
        <View style={styles.spinnerContainer}>
          <Text style={styles.questions}>¿Cuantos años has vivido ahí?</Text>
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
  const addLanguage = () => {
    setLanguages((languages) => [
      ...languages,
      { lengua: newLang, checked: true },
    ]);
  };
  const changeProfileImage = () => {};
  const manageChips = (text) => {
    console.log(text);
    var auxArray = languages.map(function (item) {
      if (item.lengua === text) {
        if (item.checked === false) {
          return { ...item, checked: true };
        } else {
          return { ...item, checked: false };
        }
      } else {
        return item;
      }
    });
    setLanguages(auxArray);
  };
  const showChips = () => {
    var chips = languages.map(function (language) {
      return (
        <Chip
          key={language.lengua}
          selected={language.checked}
          style={styles.chipStyles}
          onPress={() => manageChips(language.lengua)}
        >
          {language.lengua}
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
          label="¿En que ciudad vives?"
          placeholder="Ciudad"
          style={styles.inputs}
          onChangeText={(text) => setCity({ value: text, error: "" })}
        ></TextInput>
        <Text style={styles.questions}>¿Eres autóctono de esta ciudad?</Text>
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
        <Text style={styles.questions}>¿Que idiomas hablas?</Text>
        {showChips()}

        <Text style={styles.questions}>Otro:</Text>

        <View style={styles.addLangContainer}>
          <TextInput
            label="Añade otra lengua o dialecto"
            placeholder="Idioma"
            onChangeText={(text) => setNewLang(text.toString())}
            style={styles.inputs}
          ></TextInput>
          <Button
            onPress={() => addLanguage()}
            //style={styles.buttonAdd}
            //color="#00BFFF"
            mode="outlined"
          >
            Añadir
          </Button>
        </View>
        <View style={styles.descriptionContainer}>
          {/* <Text style={styles.questions}>Breve descripción personal:</Text> */}
          <TextInput
            label="Breve descripción personal:"
            placeholder="¿Que es lo primero que te gustaría que los visitantes sepan de ti?"
            style={styles.inputs}
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => setDescription({ value: text, error: "" })}
          ></TextInput>
        </View>
        <Button
          //color="#00BFFF"
          //style={styles.buttonSave}
          mode="contained"
        >
          Guardar perfil
        </Button>
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
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
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
    marginTop: 16,
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

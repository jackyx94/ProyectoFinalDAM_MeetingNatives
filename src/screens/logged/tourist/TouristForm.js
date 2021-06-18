import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, RadioButton } from "react-native-paper";
import { Button, TextInput } from "../../../customComponents";
import InputSpinner from "react-native-input-spinner";
import { FormHeader, CustomChips } from "../../../customComponents";
import { stringValidator } from "../../../helpers/stringValidator";
import firebase from "firebase";

export default function TouristProfile({ navigation, route }) {
  const [checked, setChecked] = useState("yes");
  const [country, setCountry] = useState({ value: "", error: "" });
  const [companions, setCompanions] = useState(0);
  const [intrestedChips, setIntrestedChips] = useState([]);

  const chipStateHandler = (data) => {
    setIntrestedChips(data);
  };

  useEffect(() => {
    const { editingUser, type } = route.params;
    if (editingUser) {
      retrievePreviusData(editingUser, type);
    }
  }, []);

  async function retrievePreviusData(profileMail, type) {
    const dbSt = firebase.firestore();
    const userRef = dbSt.collection("users").doc(profileMail.toString());
    userRef
      .collection("typeOfUser")
      .doc(type.toString())
      .get()
      .then((doc) => {
        setCountry({ value: doc.data().originCountry, error: "" });
        setIntrestedChips(doc.data().intrestedCategories);
        if (doc.data().travelCompanions > 0) {
          setChecked("no");
        }
        setCompanions(doc.data().travelCompanions);
      })
      .catch((error) => {
        console.log(
          "Error al tratar de obtener los datos de perfil previos",
          error
        );
      });
  }
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
            value={companions}
            colorPress="#BCBCBC"
            fontSize={16}
            textColor="#696969"
            onChange={(selectedNumb) => {
              setCompanions(selectedNumb);
            }}
          />
        </View>
      );
    }
  };
  const onSaveProfile = () => {
    const countryError = stringValidator(country.value);
    if (countryError) {
      setCountry({ ...country, error: countryError });
      return;
    } else {
      //llamamos a la función que crean la referenciade los datos obtenidos
      // en firestore
      createDataRef();
    }
  };

  function createDataRef() {
    var user = firebase.auth().currentUser;
    const dbSt = firebase.firestore();
    if (user) {
      dbSt
        .collection("users")
        .doc(user.email.toString())
        .set({
          followedExperiencesId: [],
        })
        .then(() => {
          console.log("Documento actualizado correctamente");
        })
        .catch((error) => {
          console.error("Error al actualizar el documento: ", error);
        });
      dbSt
        .collection("users")
        .doc(user.email.toString())
        .update({
          currentProfile: "tourist",
        })
        .then(() => {
          console.log("Documento actualizado correctamente");
        })
        .catch((error) => {
          console.error("Error al actualizar el documento: ", error);
        });
      dbSt
        .collection("users")
        .doc(user.email)
        .collection("typeOfUser")
        .doc("tourist")
        .set({
          originCountry: country.value,
          travelCompanions: companions,
          intrestedCategories: intrestedChips,
        })
        .then(() => {
          console.log("Documento creado correctamente");

          navigation.reset({
            index: 0,
            routes: [{ name: "SideMenuContainer" }],
          });
        })
        .catch((error) =>
          console.error("Error al actualizar documento", error)
        );
    }
  }
  function updateProfile() {
    var user = firebase.auth().currentUser;
    const dbSt = firebase.firestore();
    dbSt
      .collection("users")
      .doc(user.email)
      .collection("typeOfUser")
      .doc("tourist")
      .update({
        originCountry: country.value,
        travelCompanions: companions,
        intrestedCategories: intrestedChips,
      })
      .then(() => {
        console.log("Documento actualizado correctamente");
        navigation.navigate("SideMenuContainer");
      })
      .catch((error) => {
        console.error("Error al actualizar el documento: ", error);
      });
  }
  function showChips() {
    const { categories } = route.params;
    return (
      <View>
        {categories ? (
          <CustomChips
            parent={"TouristForm"}
            chipType="categoryChips"
            handleState={chipStateHandler}
            fromFirestore={[null, categories]}
          ></CustomChips>
        ) : (
          <CustomChips
            parent={"TouristForm"}
            chipType="categoryChips"
            handleState={chipStateHandler}
            fromFirestore={null}
          ></CustomChips>
        )}
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      {FormHeader(navigation)}
      <View style={styles.body}>
        <Text style={styles.name}>Completa tu perfil</Text>
        <TextInput
          label="¿De donde eres?"
          placeholder="Pais de origen"
          value={country.value}
          error={!!country.error}
          errorText={country.error}
          style={styles.inputs}
          onChangeText={(text) => setCountry({ value: text, error: "" })}
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
        <Button
          mode="contained"
          onPress={() => {
            const { editingUser } = route.params;
            if (editingUser) {
              updateProfile();
            } else {
              onSaveProfile();
            }
          }}
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
    color: "#696969",
  },
  body: {
    width: "100%",
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  name: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#696969",
  },
});

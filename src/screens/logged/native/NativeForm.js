import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { Text, RadioButton } from "react-native-paper";
import {
  Button,
  TextInput,
  FormHeader,
  CustomChips,
  ProvinCityFilter,
  HorizontalSeparator,
} from "../../../customComponents";
import InputSpinner from "react-native-input-spinner";
import { stringValidator } from "../../../helpers/stringValidator";
import firebase from "firebase";

export default function NativeProfile({ navigation, route }) {
  const scrollRef = useRef();
  const [checked, setChecked] = useState("yes");
  const [city, setCity] = useState({ key: "", error: "" });
  const [province, setProvince] = useState({ key: "", error: "" });
  const [description, setDescription] = useState({ value: "", error: "" });
  const [yearsLived, setYearsLived] = useState(0);
  const [filterError, setFilterError] = useState("");
  const [spokenLanguages, setSpoken] = useState();

  useEffect(() => {
    const { editingUser, type } = route.params;
    if (editingUser) {
      retrievePreviusData(editingUser, type);
    }
  }, []);

  async function retrievePreviusData(profileMail, type) {
    const dbSt = firebase.firestore();
    console.log("ROUTE PARAM PROPS " + profileMail + type);
    const userRef = dbSt.collection("users").doc(profileMail.toString());
    userRef
      .collection("typeOfUser")
      .doc(type.toString())
      .get()
      .then((doc) => {
        //console.log("PREVIUS DATA " + doc.data().province);
        setProvince({ key: doc.data().province, error: "" });
        setCity({ key: doc.data().city, error: "" });
        setDescription({ value: doc.data().description, error: "" });
        setChecked(doc.data().isCityNative);
        setYearsLived(doc.data().yearsLivedCity);
      })
      .catch((error) => {
        console.log(
          "Error al tratar de obtener los datos de perfil previos",
          error
        );
      });
  }
  function updateProfile() {
    var user = firebase.auth().currentUser;
    const dbSt = firebase.firestore();
    dbSt
      .collection("users")
      .doc(user.email)
      .collection("typeOfUser")
      .doc("native")
      .update({
        city: city.key,
        province: province.key,
        isCityNative: checked,
        yearsLivedCity: yearsLived,
        description: description.value,
        languages: spokenLanguages,
      })
      .then(() => {
        console.log("Perfil nativo actualizado correctamente");
        navigation.navigate("SideMenuContainer");
      })
      .catch((error) => {
        console.error("Error al actualizar el perfil nativo: ", error);
      });
  }

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
  const onSaveProfile = () => {
    const descriptionError = stringValidator(description.value);
    var provinceError;

    if (province === undefined) {
      console.log("DENTRO IF");
      provinceError = "Debes seleccionar una provincia";
    }
    const cityError = stringValidator(city.key);
    if (descriptionError) {
      setDescription({ ...description, error: descriptionError });
      if (provinceError || cityError) {
        console.log("DENTRO SEGUNDO IF");
        setFilterError("Debes seleccionar una provincia y un municipio");
      }
      return;
    } else {
      //llamamos a la funciones que crean tanto la referenciade los datos
      // agregados si la validación es correcta
      createDataRef();
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "SideMenuContainer" }],
    });
  };
  function createDataRef() {
    var user = firebase.auth().currentUser;
    const dbSt = firebase.firestore();
    if (user) {
      dbSt
        .collection("users")
        .doc(user.email.toString())
        .update({
          currentProfile: "native",
        })
        .then(() => {
          console.log("Documento actualizado correctamente");
        })
        .catch((error) => {
          console.error("Error al actualizar el documento: ", error);
        });
      // User is signed in.
      dbSt
        .collection("users")
        .doc(user.email)
        .collection("typeOfUser")
        .doc("native")
        .set({
          active: true,
          city: city.key,
          province: province.key,
          isCityNative: checked,
          yearsLivedCity: yearsLived,
          description: description.value,
          languages: spokenLanguages,
        })
        .then(() => console.log("Documento actualizado"))
        .catch((error) =>
          console.error("Error al actualizar documento", error)
        );
    }
  }
  const chipStateHandler = (data) => {
    setSpoken(data);
  };
  const filterStateHandler = (data) => {
    setFilterError("");
    setProvince(data[0]);
    if (data[1] != null) {
      setCity(data[1]);
    }
  };
  function isFilterOk() {
    if (filterError != "") {
      scrollRef.current.scrollTo({ y: 0 });
      return <Text style={styles.filterError}>{filterError}</Text>;
    }
  }
  const { livingPlace, languages } = route.params;
  return (
    <ScrollView ref={scrollRef} style={styles.container}>
      <FormHeader></FormHeader>
      <View style={styles.body}>
        <Text style={styles.name}>Completa tu perfil</Text>
        <Text style={[styles.questions, { marginBottom: 10 }]}>
          Selecciona la provincia y ciudad dónde vives
        </Text>

        {livingPlace ? (
          <ProvinCityFilter
            handleState={filterStateHandler}
            previusData={livingPlace}
          ></ProvinCityFilter>
        ) : (
          <ProvinCityFilter handleState={filterStateHandler}></ProvinCityFilter>
        )}

        {isFilterOk()}

        <HorizontalSeparator></HorizontalSeparator>
        <Text style={[styles.questions, { marginTop: 12 }]}>
          ¿Eres autóctono de esta ciudad?
        </Text>
        <View>
          <View style={styles.radioView}>
            <View style={styles.radioItem}>
              <Text style={styles.radioQuestion}>Si</Text>
              <RadioButton
                color="#00BFFF"
                value="yes"
                status={checked === "yes" ? "checked" : "unchecked"}
                onPress={() => {
                  setChecked("yes");
                  setYearsLived(0);
                }}
              />
            </View>
            <View style={styles.radioItem}>
              <Text style={styles.radioQuestion}>No</Text>
              <RadioButton
                color="#00BFFF"
                value="no"
                status={checked === "no" ? "checked" : "unchecked"}
                onPress={() => {
                  setChecked("no");
                  setYearsLived(1);
                }}
              />
            </View>
          </View>
        </View>
        {showSpinner()}
        <HorizontalSeparator></HorizontalSeparator>
        <Text style={styles.questions}>¿Que idiomas hablas?</Text>
        <Text style={[styles.questions, { fontSize: 12, marginTop: 8 }]}>
          (mínimo 1)
        </Text>

        {languages ? (
          <CustomChips
            parent={"TouristForm"}
            chipType="languageChips"
            handleState={chipStateHandler}
            fromFirestore={[null, languages]}
          ></CustomChips>
        ) : (
          <CustomChips
            parent={"TouristForm"}
            chipType="languageChips"
            handleState={chipStateHandler}
            fromFirestore={null}
          ></CustomChips>
        )}

        <HorizontalSeparator></HorizontalSeparator>

        <View style={styles.descriptionContainer}>
          <TextInput
            label="Breve descripción personal:"
            placeholder="¿Que es lo primero que te gustaría que los visitantes sepan de ti?"
            value={description.value}
            style={styles.inputs}
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => setDescription({ value: text, error: "" })}
            error={!!description.error}
            errorText={description.error}
          ></TextInput>
        </View>
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
  filterError: {
    fontSize: 14,
    marginTop: 6,
    color: "red",
  },
  link: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#0A75F2",
  },
  descriptionContainer: {
    width: "100%",
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

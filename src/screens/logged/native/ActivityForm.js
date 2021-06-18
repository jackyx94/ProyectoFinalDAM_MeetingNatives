import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Button } from "react-native";
import { Text } from "react-native-paper";
import { Button as CustomButton, TextInput } from "../../../customComponents";
import { FormHeader } from "../../../customComponents/form";
import CustomChips from "../../../customComponents/shared/CustomChips";
import { stringValidator } from "../../../helpers/stringValidator";
import firebase from "firebase";
import Modal from "react-native-modal";

export default function ActivityForm({ navigation, route }) {
  const [duration, setDuration] = useState({ value: "", error: "" });
  const [description, setDescription] = useState({ value: "", error: "" });
  const [participants, setParticipants] = useState({ value: "", error: "" });
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [categories, setCategories] = useState(null);

  const chipStateHandler = (data) => {
    setCategories(data);
  };
  useEffect(() => {
    const { experience } = route.params;
    if (experience) {
      retrieveExperience(experience);
    }
  }, []);
  async function retrieveExperience(experience) {
    const dbSt = firebase.firestore();
    const experiencesRef = dbSt.collection("sharedData");
    firebase
      .firestore()
      .collection("sharedData")
      .doc(experience[0])
      .get()
      .then((docRef) => {
        setDescription({ value: docRef.data().description, error: "" });
        setParticipants({ value: docRef.data().participants, error: "" });
        setDuration({ value: docRef.data().duration, error: "" });
      })
      .catch((error) => {});
  }
  const onAddActivity = () => {
    const durationError = stringValidator(duration.value);
    const descriptionError = stringValidator(description.value);
    const participantsError = stringValidator(participants.value);

    if (durationError || descriptionError || participantsError) {
      setDuration({ ...duration, error: durationError });
      setDescription({ ...description, error: descriptionError });
      setParticipants({ ...participants, error: participantsError });
      return;
    } else {
      const { experience } = route.params;
      if (experience != null) {
        //llamamos a la funciones que crean tanto la referenciade los datos
        // agregados si la validación es correcta
        updateDocument(experience[0]);
      } else {
        createDocument();
      }
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "SideMenuContainer" }],
    });
  };
  function onDeleteActivity() {
    const { experience } = route.params;

    console.log("idBorrar " + experience[0]);
    const dbSt = firebase.firestore();
    dbSt
      .collection("sharedData")
      .doc(experience[0])
      .delete()
      .then(() => {
        console.log("Experiencia borrada correctamente");
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Error al tratar de borrar la experiencia: ", error);
      });
  }
  function updateDocument(documentId) {
    const dbSt = firebase.firestore();
    var experienceRef = dbSt
      .collection("sharedData")
      .doc(documentId.toString());
    return experienceRef
      .update({
        description: description.value,
        categories: categories,
        duration: duration.value,
        participants: participants.value,
      })
      .then(() => {
        console.log("Experiencia actualizada");
      })
      .catch((error) => {
        console.error("Error al tratar de actualizar la experiencia: ", error);
      });
  }
  async function createDocument() {
    var unSuscribe = firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        const dbSt = firebase.firestore();
        //AÑADIR EXPERIENCIAS AL DOCUMENTO EN FIRESTORE
        console.log("USEREMAIL " + user.email);
        const retrievePlace = await dbSt
          .collection("users")
          .doc(user.email)
          .collection("typeOfUser")
          .doc("native");
        retrievePlace
          .get()
          .then((doc) => {
            dbSt.collection("sharedData").add({
              creatorUser: user.email,
              province: doc.data().province,
              city: doc.data().city,
              description: description.value,
              categories: categories,
              duration: duration.value,
              participants: participants.value,
              ratingValues: [{ value: 2.5, user: "default" }],
              ratingUsers: ["default"],
              ratingAverage: 2.5,
            });
          })
          .catch((error) => {
            console.error("Error al solicitar: ", error);
          });
      } else {
        console.log("No hay usuario logueado ACTIVITY FORM");
      }
    });
    unSuscribe();
  }
  const { experience } = route.params;

  return (
    <ScrollView style={styles.container}>
      {FormHeader(navigation)}
      <View style={styles.body}>
        <Text style={styles.name}>Añadir actividad</Text>
        <View style={styles.descriptionContainer}>
          <TextInput
            label="Descripción de la actividad:"
            placeholder="Describe la experiencia que ofreces"
            value={description.value}
            style={styles.inputs}
            multiline={true}
            numberOfLines={6}
            onChangeText={(text) => setDescription({ value: text, error: "" })}
            error={!!description.error}
            errorText={description.error}
          ></TextInput>
        </View>
        <Text style={styles.questions}>
          ¿Qué categorías se ajustan más a la actividad?
        </Text>
        <Text style={[styles.questions, { fontSize: 12, marginTop: 8 }]}>
          (mínimo 1)
        </Text>
        <CustomChips
          parent={"ActivityForm"}
          chipType="categoryChips"
          handleState={chipStateHandler}
          fromFirestore={route.params.experience}
        ></CustomChips>
        <TextInput
          label="Duración aproximada"
          value={duration.value}
          placeholder="Ejemplo: de 2 a 3 horas"
          style={styles.inputs}
          onChangeText={(text) => setDuration({ value: text, error: "" })}
          error={!!duration.error}
          errorText={duration.error}
        ></TextInput>
        <TextInput
          value={participants.value}
          label="Rango de participantes"
          placeholder="Ejemplo: no más de 3"
          style={styles.inputs}
          onChangeText={(text) => setParticipants({ value: text, error: "" })}
          error={!!participants.error}
          errorText={participants.error}
        ></TextInput>
        <CustomButton mode="contained" onPress={() => onAddActivity()}>
          Guardar
        </CustomButton>
        {experience ? (
          <CustomButton
            mode="contained"
            onPress={() => setModalDeleteVisible(true)}
          >
            Borrar experiencia
          </CustomButton>
        ) : null}
      </View>
      <Modal isVisible={modalDeleteVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalRatingView}>
            <Text style={styles.ratingTitle}>
              ¿Estás seguro de que quieres cerrar la sesión actual?
            </Text>
          </View>
          <Button
            title="Cancelar"
            onPress={() => setModalDeleteVisible(false)}
          />
          <View style={{ height: 10 }}></View>
          <Button
            title="Aceptar"
            onPress={() => {
              onDeleteActivity();
              setModalDeleteVisible(false);
            }}
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ratingTitle: {
    marginTop: 10,
    marginBottom: 10,
    textAlignVertical: "center",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
  },
  modalRatingView: {
    alignSelf: "center",
    height: 100,
    width: 200,
    marginBottom: 10,
    borderRadius: 2,
    backgroundColor: "white",
  },
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
    fontSize: 20,
    color: "#696969",
  },
});

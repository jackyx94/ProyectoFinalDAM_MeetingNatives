import { Chip } from "react-native-paper";
import { View, StyleSheet, Button } from "react-native";
import { Text } from "react-native-paper";
import { Button as CustomButton, TextInput } from "../../customComponents";
import React, { useState, useRef, useEffect } from "react";
import { stringValidator } from "../../helpers/stringValidator";
import firebase from "firebase";
import Modal from "react-native-modal";

export default function CustomChips({
  chipType,
  handleState,
  parent,
  fromFirestore,
}) {
  const [newItem, setNewItem] = useState({ value: "", error: "" });
  const [newItemExists, setNewItemExists] = useState(false);
  const [items, setItems] = useState([]);
  //var firstRender = useRef(true);
  useEffect(() => {
    //solamente se ejecutará en el primer renderizado
    retrieveChipData();
  }, []);
  useEffect(() => {
    //mandamos el estado de los chips al componente padre para gestionar
    // allí los datos del formulario cada vez que se actualice la variable de estado items
    returnState();
  }, [items]);

  const addNewChip = (chipType) => {
    const newItemError = stringValidator(newItem.value);
    if (newItemError) {
      setNewItem({ ...newItem, error: newItemError });
      return;
    } else {
      var dbSt = firebase.firestore();
      dbSt
        .collection("appData")
        .doc("chipValues")
        .get()
        .then((doc) => {
          if (chipType === "languages") {
            if (!doc.data().languages.includes(newItem.value)) {
              var dbSt = firebase.firestore();
              dbSt
                .collection("appData")
                .doc("chipValues")
                .update({
                  languages: firebase.firestore.FieldValue.arrayUnion(
                    newItem.value
                  ),
                });
              setItems((items) => [
                ...items,
                { value: newItem.value, checked: true },
              ]);
              setNewItem({ value: "", error: "" });
            } else {
              setNewItemExists(true);
            }
          } else if (chipType === "category") {
            if (!doc.data().category.includes(newItem.value)) {
              var dbSt = firebase.firestore();
              dbSt
                .collection("appData")
                .doc("chipValues")
                .update({
                  category: firebase.firestore.FieldValue.arrayUnion(
                    newItem.value
                  ),
                });
              setItems((items) => [
                ...items,
                { value: newItem.value, checked: true },
              ]);
              setNewItem({ value: "", error: "" });
            } else {
              setNewItemExists(true);
            }
          }
        });
    }
  };

  function retrieveChipData() {
    var dbSt = firebase.firestore();
    dbSt
      .collection("appData")
      .doc("chipValues")
      .get()
      .then((doc) => {
        //comprobamos si el estado de los chips(categorias) hay que cargarlo en base a
        //datos almacenados de una experience(cuando se intenta hacer un update) o si
        //se trata de una llamada desde el formulario de nueva experiencia
        if (fromFirestore != null && chipType === "categoryChips") {
          var rawArray = [];
          doc.data().category.map(function (item) {
            rawArray.push({ value: item, checked: false });
          });
          //cargamos las categorias almacenadas y pasamos a chekear las que coincidan con
          //las almacenadas en la experiencia
          //console.log("QUE ES FROM FIRESTORE " + fromFirestore[1]);
          fromFirestore[1].map(function (item) {
            var auxChip = { value: item, checked: false };
            rawArray = setChekedChips(auxChip, rawArray);
            setItems(rawArray);
          });
        } else if (fromFirestore != null && chipType === "languageChips") {
          var rawArray = [];
          doc.data().languages.map(function (item) {
            rawArray.push({ value: item, checked: false });
          });
          //cargamos las categorias almacenadas y pasamos a chekear las que coincidan con
          //las almacenadas en la experiencia
          //console.log("QUE ES FROM FIRESTORE " + fromFirestore[1]);
          fromFirestore[1].map(function (item) {
            var auxChip = { value: item, checked: false };
            rawArray = setChekedChips(auxChip, rawArray);
            setItems(rawArray);
          });
        } else {
          //cargamos las categorías o idiomas almacenadas y checkeamos una por defecto a modo
          //de ejemplo para el usuario ya que 1 será el mínimo requerido
          var auxArray = [];
          if (chipType === "languageChips") {
            doc.data().languages.map(function (item) {
              if (item === "Español") {
                auxArray.push({ value: item, checked: true });
              } else {
                auxArray.push({ value: item, checked: false });
              }
            });
          } else {
            doc.data().category.map(function (item) {
              if (parent != "touristHome") {
                if (item === "Playa") {
                  auxArray.push({ value: item, checked: true });
                } else {
                  auxArray.push({ value: item, checked: false });
                }
              } else {
                auxArray.push({ value: item, checked: false });
              }
            });
          }
          setItems(auxArray);
        }
      })
      .catch((error) => {
        console.error("Error retrieving chips ", error);
      });
  }
  function addChipView() {
    if (parent != "touristHome") {
      var addText;
      var addHolder;
      var type;
      switch (chipType) {
        case "languageChips":
          type = "languages";
          addText = "Añade otra lengua o dialecto";
          addHolder = "Lengua o dialecto";
          break;
        case "categoryChips":
          type = "category";
          addText = "Añade otra categoría";
          addHolder = "Nueva categoría";
          break;
        default:
          break;
      }
      return (
        <View style={styles.addLangContainer}>
          <Text style={styles.questions}>Otro:</Text>
          <TextInput
            label={addText}
            value={newItem.value}
            error={!!newItem.error}
            errorText={newItem.error}
            placeholder={addHolder}
            onChangeText={(text) =>
              setNewItem({ value: text.toString(), error: "" })
            }
            style={styles.inputs}
          ></TextInput>
          <CustomButton onPress={() => addNewChip(type)} mode="outlined">
            Añadir
          </CustomButton>
          <Modal isVisible={newItemExists}>
            <View style={styles.modalContainer}>
              <View style={[styles.modalRatingView, { height: 60 }]}>
                <Text
                  style={[
                    styles.ratingTitle,
                    { textAlign: "center", textAlignVertical: "center" },
                  ]}
                >
                  ¡El item {newItem.value} ya está en la lista!
                </Text>
              </View>
              <View style={{ height: 10 }}></View>
              <Button title="Aceptar" onPress={() => setNewItemExists(false)} />
            </View>
          </Modal>
        </View>
      );
    }
  }
  const manageChips = (chip) => {
    var checked = getCheked();
    console.log("GET CHEKED " + checked + " " + parent);
    if (parent != "touristHome") {
      //condicion para comprobar que siempre haya al menos un chip marcado , ya que toda persona
      //habla mínimo un idioma y porque toda experience debe estar relacionada con una categoría
      if (checked.length >= 1) {
        //si hay solamente un chip marcado, solo permitiremos modificar el estado de aquellos que
        // no esten marcados, de lo contrario podríamos quedarnos con 0 y no está permitido
        if (checked.length === 1 && chip.checked != true) {
          setChekedChips(chip);
        } else if (checked.length > 1) {
          setChekedChips(chip);
        }
      }
      //si nos cargamos el componente chips desde el de filtro, si hay que permitir que no haya ninguna
      //categoría marcada para, por ejemplo, filtrar solamente por provincia o ciudad
    } else {
      setChekedChips(chip);
    }
  };
  function setChekedChips(chip, stateless = null) {
    var iterable;
    if (stateless != null) {
      var auxArray = stateless.map(function (item) {
        if (item.value === chip.value) {
          if (item.checked === false) {
            return { ...item, checked: true };
          } else {
            return { ...item, checked: false };
          }
        } else {
          return item;
        }
      });
      console.log("inside setchecked " + auxArray);
      return auxArray;
    } else {
      var auxArray = items.map(function (item) {
        if (item.value === chip.value) {
          if (item.checked === false) {
            return { ...item, checked: true };
          } else {
            return { ...item, checked: false };
          }
        } else {
          return item;
        }
      });
      setItems(auxArray);
    }
  }
  function getCheked() {
    var auxArray = [];
    items.map(function (item) {
      if (item.checked === true) {
        auxArray.push(item.value);
      }
    });
    return auxArray;
  }
  function returnState() {
    handleState(getCheked());
  }
  const showChips = () => {
    var chips = items.map(function (item) {
      return (
        <Chip
          key={item.value}
          selected={item.checked}
          style={styles.chipStyles}
          onPress={() => {
            manageChips(item);
          }}
        >
          {item.value}
        </Chip>
      );
    });
    return (
      <View>
        <View style={styles.chipContainer}>{chips}</View>
        {addChipView()}
      </View>
    );
  };
  return showChips();
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
  chipStyles: {
    marginRight: 16,
    marginBottom: 10,
  },
  chipContainer: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    justifyContent: "center",
  },
  inputs: {
    marginTop: 16,
  },
  questions: {
    marginTop: 16,
    fontSize: 16,
    color: "#696969",
  },
});

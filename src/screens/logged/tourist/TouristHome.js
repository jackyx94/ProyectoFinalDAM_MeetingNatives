import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Button } from "react-native";
import { Text } from "react-native-paper";
import { Button as CustomButton } from "../../../customComponents";
import CustomChips from "../../../customComponents/shared/CustomChips";
import ProvinCityFilter from "../../../customComponents/shared/ProvinCityFilter";
import firebase from "firebase";
import ExperienceCard from "../../../customComponents/shared/ExperienceCard";
import FollowedExperiences from "../../../customComponents/tourist/FollowedExperiences";
import ChatRooms from "../../../customComponents/interaction/ChatRooms";
import Modal from "react-native-modal";
export default function TouristHome({
  currentTouristContent,
  handleContentState,
  scrollEnd,
}) {
  const [categories, setCategories] = useState(null);
  const [content, setContent] = useState("filtering");
  const [filterData, setFilterData] = useState(null);
  const [filterError, setFilterError] = useState("");
  const [retrievedExperiences, setRetrieved] = useState([]);
  const [modalFilterNofound, setModalFilterNofound] = useState(false);

  useEffect(() => {
    console.log("useEffect " + currentTouristContent);
    if (content != currentTouristContent) {
      setContent(currentTouristContent);
    }
  }, [currentTouristContent]);
  useEffect(() => {
    //mandamos el estado de los chips al componente padre para gestionar
    // allí los datos del formulario cada vez que se actualice la variable de estado items
    returnState();
  }, [content]);
  function returnState() {
    return handleContentState(content);
  }
  const chipStateHandler = (data) => {
    setCategories(data);
  };
  useEffect(() => {
    manageContent();
  }, [retrievedExperiences]);
  const filterStateHandler = (data) => {
    setFilterError("");
    setFilterData(data);
  };
  async function retrieveFilteredExperiences() {
    if (filterData[0] === "") {
      setFilterError("Debes seleccionar al menos una provincia");
    } else {
      const dbSt = firebase.firestore();
      const experiencesRef = dbSt.collection("sharedData");

      //añadimos clausula where a la consulta para filtrar por provincia
      var query = experiencesRef.where(
        "province",
        "==",
        filterData[0].key.toString()
      );
      //si filterData[1] existe, significa que se ha elegido una ciudad también
      //por lo tanto añadimos segunda clausula where para filtrar por provincia y ciudad
      if (filterData[1] != "") {
        query = experiencesRef.where(
          "city",
          "==",
          filterData[1].key.toString()
        );
      }

      const snapshot = await query.get();
      if (snapshot.empty) {
        //si no se ha encontrado ninguna actividad en la provincia y ciudad elegidas
        setModalFilterNofound(true);
        console.log("No matching documents.");
        return;
      }
      //si se han encontrado actividades en esa ciudad, pasamos a filtrar por categorias
      setRetrieved([]);
      var auxArray = [];
      if (categories.length != 0) {
        snapshot.forEach((doc) => {
          if (doc.data().categories.some((cat) => categories.includes(cat))) {
            auxArray.push([doc.data(), doc.id]);
          } else {
            return;
          }
        });
        if (auxArray.length === 0) {
          setModalFilterNofound(true);
          return;
        }
        setRetrieved(auxArray);
        setContent("filtered");
      } else {
        snapshot.forEach((doc) => {
          setRetrieved((oldArray) => [...oldArray, [doc.data(), doc.id]]);
        });
        setContent("filtered");
      }
    }
  }
  const chatStateHandler = (data) => {
    setContent(data);
  };
  function manageContent() {
    switch (content) {
      case "filtering":
        return filterExperiences();
      case "filtered":
        if (retrievedExperiences.length > 0) {
          var experiences = retrievedExperiences.map((item) => {
            return (
              <ExperienceCard
                ratingDisabled={true}
                key={item[1]}
                data={item}
                parent={"touristSearching"}
              ></ExperienceCard>
            );
          });
          return <View>{experiences}</View>;
        }
        break;
      case "followed":
        return <FollowedExperiences></FollowedExperiences>;
      case "chatRooms":
        return (
          <ChatRooms
            parent={"touristMail"}
            handleChatState={chatStateHandler}
            scrollEnd={scrollEnd}
          ></ChatRooms>
        );
      default:
        break;
    }
  }
  function filterExperiences() {
    return (
      <View>
        <View>
          <Text style={styles.headerText}>Filtrar actividades</Text>
          <View style={styles.horizontalLine}></View>
          <Text style={styles.titles}>Ubicación</Text>
          <ProvinCityFilter handleState={filterStateHandler}></ProvinCityFilter>
          <Text style={styles.filterError}>{filterError}</Text>
        </View>
        <View style={[styles.horizontalLine, { marginTop: 0 }]}></View>
        <Text style={styles.titles}>Categorias</Text>
        <CustomChips
          parent={"touristHome"}
          chipType={"categoryChips"}
          handleState={chipStateHandler}
        ></CustomChips>
        <CustomButton
          style={styles.searchButton}
          mode="contained"
          onPress={() => retrieveFilteredExperiences()}
        >
          Buscar
        </CustomButton>
        <Modal isVisible={modalFilterNofound}>
          <View style={styles.modalContainer}>
            <View style={styles.modalRatingView}>
              <Text style={styles.ratingTitle}>
                ¡No se han encontrado experiencias con estos parámetros de
                busqueda!
              </Text>
            </View>
            <View style={{ height: 10 }}></View>
            <Button
              title="Aceptar"
              onPress={() => {
                setModalFilterNofound(false);
              }}
            />
          </View>
        </Modal>
      </View>
    );
  }
  return <View>{manageContent()}</View>;
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
    height: 80,
    width: 200,
    marginBottom: 10,
    borderRadius: 2,
    backgroundColor: "white",
  },
  filterError: {
    alignSelf: "center",
    fontSize: 14,
    marginTop: 6,
    color: "red",
  },
  searchButton: {
    marginTop: 20,
    alignSelf: "center",
    maxWidth: "80%",
  },
  horizontalLine: {
    borderColor: "#e3e3e3",
    borderBottomWidth: 2,
    marginHorizontal: 10,
    marginTop: 10,
    paddingBottom: 10,
  },
  headerText: {
    marginTop: 12,
    fontSize: 18,
    color: "#696969",
    alignSelf: "center",
  },
  titles: {
    alignSelf: "center",
    margin: 10,
    fontSize: 16,
    color: "#696969",
  },
});

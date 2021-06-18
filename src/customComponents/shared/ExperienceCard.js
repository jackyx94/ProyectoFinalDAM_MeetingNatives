import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { Text } from "react-native-paper";
import { Rating } from "react-native-ratings";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase";
import Modal from "react-native-modal";
import manAvatar from "../../assets/manAvatar.png";
export default function ExperienceCard({
  data,
  parent = null,
  refreshFollowed,
  ratingDisabled = false,
}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRatedModalVisible, setRatedModalVisible] = useState(false);
  const [addingToFollowed, setAddingToFollowed] = useState(false);
  const [alreadyAddedToFollowed, setAlreadyAddedToFollowed] = useState(false);
  const [ratingValue, setRatingValue] = useState(3);
  const [alreadyOpenedConversation, setAlreadyOpenedConversation] =
    useState(false);
  const [openingConversation, setOpeningConversation] = useState(false);
  const [modalDeleteFollowed, setModalDeleteFollowed] = useState(false);
  const [modalYouNeedToTalk, setModalYouNeedToTalk] = useState(false);
  useState(false);

  const toggleModalSave = (experienceId) => {
    setModalVisible(!isModalVisible);
    rateExperienceDb(experienceId);
  };
  const toggleModalCancel = () => {
    setModalVisible(!isModalVisible);
  };
  //funcion que comprueba el tipo de tarjetas que tiene que mostrar en funcion
  // del que componente padre le haya llamado
  const navigation = useNavigation();
  function manageCardType() {
    if (parent === "touristSearching" || parent === "touristFollowed") {
      return rawCard();
    } else {
      return (
        <TouchableOpacity
          key={data[1]}
          onPress={() =>
            navigation.navigate("ActivityForm", {
              experience: [data[1], data[0].categories],
            })
          }
        >
          {rawCard()}
        </TouchableOpacity>
      );
    }
  }
  //funcion que maneja algunos de las interfaces modal que se muestran al usuario
  async function manageModals(experienceId) {
    var user = firebase.auth().currentUser;
    const dbSt = firebase.firestore();
    var experienceRefIsRated = dbSt.collection("sharedData").doc(experienceId);
    experienceRefIsRated
      .get()
      .then(async (doc) => {
        if (!doc.data().ratingUsers.includes(user.email)) {
          const checkExist = dbSt.collection("openChats");

          var query = checkExist
            .where("touristMail", "==", user.email)
            .where("nativeMail", "==", data[0].creatorUser);

          const snapshot = await query.get();
          if (snapshot.empty) {
            setModalYouNeedToTalk(true);
          } else {
            setModalVisible(true);
          }
        } else {
          setRatedModalVisible(true);
        }
      })
      .catch((error) => {
        console.error("Error al solicitar: ", error);
      });
  }
  //funcion encargada de manejar la valoración que un usuario turista realiza a una
  // experiencia en concreto
  function rateExperienceDb(experienceId) {
    var user = firebase.auth().currentUser;
    const dbSt = firebase.firestore();
    var experienceRefIsRated = dbSt.collection("sharedData").doc(experienceId);
    var experienceRef = dbSt.collection("sharedData").doc(experienceId);
    experienceRefIsRated
      .get()
      .then((doc) => {
        console.log(doc.data());
        if (!doc.data().ratingUsers.includes(user.email)) {
          var count = 1;
          var total = ratingValue;
          doc.data().ratingValues.forEach((item) => {
            count = count + 1;
            total = total + item.value;
          });
          var currentAverage = total / count;
          experienceRef
            .update({
              ratingValues: firebase.firestore.FieldValue.arrayUnion({
                value: ratingValue,
                user: user.email,
              }),
              ratingUsers: firebase.firestore.FieldValue.arrayUnion(user.email),
              ratingAverage: currentAverage,
            })
            .then(() => {
              console.log("Documento actualizado correctamente");
            })
            .catch((error) => {
              console.error("Error al actualizar el documento: ", error);
            });
        } else {
          console.log("Ya has rateado esta experiencia");
        }
      })
      .catch((error) => {
        console.error("Error al solicitar: ", error);
      });
  }
  //funcion que añade experiencias a la lista de intereses de los usuarios turista
  function addFollowedExperience() {
    var user = firebase.auth().currentUser;
    const dbSt = firebase.firestore();
    var userDoc = dbSt.collection("users").doc(user.email.toString());

    userDoc
      .get()
      .then((doc) => {
        if (doc.data().followedExperiencesId.includes(data[1])) {
          setAlreadyAddedToFollowed(true);
        } else {
          userDoc
            .update({
              followedExperiencesId: firebase.firestore.FieldValue.arrayUnion(
                data[1].toString()
              ),
            })
            .then(() => {
              setAddingToFollowed(true);
              console.log("Documento actualizado correctamente");
            })
            .catch((error) => {
              console.error("Error al actualizar el documento: ", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error al actualizar el documento: ", error);
      });
  }
  function deleteFromFollowed() {
    var user = firebase.auth().currentUser;
    const dbSt = firebase.firestore();
    var userDoc = dbSt.collection("users").doc(user.email.toString());
    return userDoc
      .update({
        followedExperiencesId: firebase.firestore.FieldValue.arrayRemove(
          data[1].toString()
        ),
      })
      .then(() => {
        refreshFollowed((current) => !current);
        setModalDeleteFollowed(false);
        console.log("Experiencia borrada de la lista de intereses");
      })
      .catch((error) => {
        console.error("Error al actualizar el documento: ", error);
      });
  }

  async function openChatRoom() {
    var user = firebase.auth().currentUser;
    const dbSt = firebase.firestore();
    const checkExist = dbSt.collection("openChats");

    var query = checkExist
      .where("touristMail", "==", user.email)
      .where("nativeMail", "==", data[0].creatorUser);

    const snapshot = await query.get();
    if (snapshot.empty) {
      dbSt.collection("openChats").doc().set({
        nativeMail: data[0].creatorUser,
        touristMail: user.email,
      });
      setOpeningConversation(true);
    } else {
      setAlreadyOpenedConversation(true);
      console.log("Chat with " + data[0].creatorUser + " already exists");
    }
    return snapshot;
  }

  function modalsContainer() {
    return (
      <View>
        <Modal isVisible={alreadyOpenedConversation}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalRatingView, { height: 120 }]}>
              <Text
                style={[
                  styles.ratingTitle,
                  { textAlign: "center", textAlignVertical: "center" },
                ]}
              >
                ¡Ya tienes abierta una conversación con {data[0].creatorUser}!
              </Text>
              <Text
                style={[
                  styles.ratingTitle,
                  { textAlign: "center", textAlignVertical: "center" },
                ]}
              >
                Ve a la sala de chats abiertos
              </Text>
            </View>
            <View style={{ height: 10 }}></View>
            <Button
              title="Aceptar"
              onPress={() => setAlreadyOpenedConversation(false)}
            />
          </View>
        </Modal>
        <Modal isVisible={openingConversation}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalRatingView, { height: 120 }]}>
              <Text
                style={[
                  styles.ratingTitle,
                  { textAlign: "center", textAlignVertical: "center" },
                ]}
              >
                ¡Acabas de abrir una conversación con {data[0].creatorUser}!
              </Text>
              <Text
                style={[
                  styles.ratingTitle,
                  { textAlign: "center", textAlignVertical: "center" },
                ]}
              >
                Buscala en tu sala de chats abiertos
              </Text>
            </View>
            <View style={{ height: 10 }}></View>
            <Button
              title="Aceptar"
              onPress={() => setOpeningConversation(false)}
            />
          </View>
        </Modal>
        <Modal isVisible={isModalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalRatingView}>
              <Text style={styles.ratingTitle}>¡Valora la experiencia!</Text>
              <Rating
                ratingCount={5}
                startingValue={3}
                imageSize={30}
                onFinishRating={(rating) => setRatingValue(rating)}
                //readonly={true}
              ></Rating>
            </View>
            <Button title="Cancelar" onPress={() => toggleModalCancel()} />
            <View style={{ height: 10 }}></View>
            <Button title="Aceptar" onPress={() => toggleModalSave(data[1])} />
          </View>
        </Modal>
        <Modal isVisible={isRatedModalVisible}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalRatingView, { height: 60 }]}>
              <Text
                style={[
                  styles.ratingTitle,
                  { textAlign: "center", textAlignVertical: "center" },
                ]}
              >
                ¡Ya has valorado esta experiencia!
              </Text>
            </View>
            <View style={{ height: 10 }}></View>
            <Button
              title="Aceptar"
              onPress={() => setRatedModalVisible(false)}
            />
          </View>
        </Modal>
        <Modal isVisible={alreadyAddedToFollowed}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalRatingView, { height: 60 }]}>
              <Text
                style={[
                  styles.ratingTitle,
                  { textAlign: "center", textAlignVertical: "center" },
                ]}
              >
                ¡Esta experiencia ya esta en tu carpeta de intereses!
              </Text>
            </View>
            <View style={{ height: 10 }}></View>
            <Button
              title="Aceptar"
              onPress={() => setAlreadyAddedToFollowed(false)}
            />
          </View>
        </Modal>
        <Modal isVisible={modalYouNeedToTalk}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalRatingView, { height: 100 }]}>
              <Text
                style={[
                  styles.ratingTitle,
                  { textAlign: "center", textAlignVertical: "center" },
                ]}
              >
                Para poder valorar una experiencia debes, al menos, haber
                iniciado una conversacion con el usuario que la ofrece
              </Text>
            </View>
            <View style={{ height: 10 }}></View>
            <Button
              title="Aceptar"
              onPress={() => setModalYouNeedToTalk(false)}
            />
          </View>
        </Modal>
        <Modal isVisible={addingToFollowed}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalRatingView, { height: 120 }]}>
              <Text
                style={[
                  styles.ratingTitle,
                  { textAlign: "center", textAlignVertical: "center" },
                ]}
              >
                ¡Has añadido una experiencia!
              </Text>
              <Text
                style={[
                  styles.ratingTitle,
                  { textAlign: "center", textAlignVertical: "center" },
                ]}
              >
                Buscala en tu carpeta de intereses
              </Text>
            </View>
            <View style={{ height: 10 }}></View>
            <Button
              title="Aceptar"
              onPress={() => setAddingToFollowed(false)}
            />
          </View>
        </Modal>
        <Modal isVisible={modalDeleteFollowed}>
          <View style={styles.modalContainer}>
            <View style={styles.modalRatingView}>
              <Text style={styles.ratingTitle}>
                ¿Estás seguro de que deseas borrar esta experiencia de tu
                carpeta de intereses?
              </Text>
            </View>
            <Button
              title="Cancelar"
              onPress={() => setModalDeleteFollowed(false)}
            />
            <View style={{ height: 10 }}></View>
            <Button
              title="Aceptar"
              onPress={() => {
                deleteFromFollowed();
              }}
            />
          </View>
        </Modal>
      </View>
    );
  }
  function touristButtonInteraction() {
    const buttons = [];
    var containerStyle;
    if (parent === "touristSearching") {
      containerStyle = styles.singleButtonContainer;
      buttons.push(
        <Button
          onPress={() => {
            addFollowedExperience();
          }}
          style={styles.intrestedButton}
          title="¡Me interesa!"
        ></Button>
      );
    } else if (parent === "touristFollowed") {
      buttons.push(
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Button
            onPress={() => setModalDeleteFollowed(true)}
            style={[styles.intrestedButton, { marginRight: 30 }]}
            title="Descartar"
          ></Button>

          <View style={{ width: 20 }}></View>

          <Button
            onPress={() => openChatRoom()}
            style={[styles.intrestedButton, { marginLeft: 20 }]}
            title="Contactar"
          ></Button>
        </View>
      );
    }
    return <View style={containerStyle}>{buttons}</View>;
  }
  function generateTags(array) {
    return (
      <Text
        style={{
          alignSelf: "center",
          marginTop: 2,
          fontSize: 10,
          fontStyle: "italic",
          color: "#696969",
        }}
      >
        Tags: {array}
      </Text>
    );
  }
  function touristCardsHeader() {
    var tags = generateTags(data[0].categories);
    return (
      <View style={styles.touristCardHeader}>
        <View style={styles.sideMenuAvatarContainer}>
          <Image style={styles.experienceAvatar} source={manAvatar} />
          <Text
            style={{
              flex: 1,
              fontSize: 12,
              alignSelf: "center",
              color: "#696969",
            }}
          >
            {data[0].creatorUser}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={{ fontSize: 18, alignSelf: "center", color: "#696969" }}>
            {data[0].province} / {data[0].city}
          </Text>
          {tags}
        </View>
      </View>
    );
  }
  function rawCard() {
    var disableRating;
    if (parent === "native") {
      disableRating = true;
    } else {
      disableRating = false;
    }
    return (
      <View style={styles.cardComponent}>
        {touristCardsHeader()}
        <View style={styles.cardBody}>
          <View style={styles.activityImageContainer}>
            <Image
              style={styles.activityImage}
              source={{ uri: "https://picsum.photos/200/300" }}
            ></Image>
          </View>
          <View style={styles.activityContent}>
            <View styles={styles.cardDescriptionContainer}>
              <Text style={[styles.cardTitles]}>Descripción</Text>
              <Text
                numberOfLines={5}
                ellipsizeMode="tail"
                style={[styles.cardText, { textAlign: "center" }]}
              >
                {data[0].description}
              </Text>
            </View>
            <View style={styles.cardDataContainer}>
              <View style={styles.extraData}>
                <Text style={styles.cardTitles}>Duración</Text>
                <Text style={styles.cardText}>{data[0].duration}</Text>
              </View>
              <View style={styles.extraData}>
                <Text style={styles.cardTitles}>Participantes</Text>
                <Text style={styles.cardText}>{data[0].participants}</Text>
              </View>
            </View>
            <View style={styles.ratingContainer}>
              {ratingDisabled ? (
                <TouchableOpacity
                  disabled={ratingDisabled}
                  onPress={() => manageModals(data[1])}
                >
                  <Rating
                    startingValue={data[0].ratingAverage}
                    imageSize={30}
                    readonly={true}
                  ></Rating>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  disabled={disableRating}
                  onPress={() => manageModals(data[1])}
                >
                  <Rating
                    startingValue={data[0].ratingAverage}
                    imageSize={30}
                    readonly={true}
                  ></Rating>
                </TouchableOpacity>
              )}
            </View>
            {touristButtonInteraction()}
          </View>
          {modalsContainer()}
        </View>
      </View>
    );
  }
  return manageCardType();
}

const styles = StyleSheet.create({
  headerInfo: {
    flex: 8,
    justifyContent: "center",
  },
  sideMenuAvatarContainer: {
    flex: 4,
  },
  experienceAvatar: {
    alignSelf: "center",
    flex: 2,
    width: 60,
    height: 60,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
  },
  touristCardHeader: {
    height: 280,
    flexDirection: "row",
    flex: 2,
  },
  cardBody: {
    flex: 5,
    flexDirection: "row",
  },
  cardComponent: {
    marginTop: 10,
    width: "100%",
    height: 300,
    marginBottom: 10,
  },
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
  modalView: {
    flex: 1,
  },
  singleButtonContainer: {
    flex: 1,
    height: 6,
    justifyContent: "flex-end",
  },
  intrestedButton: {
    bottom: 0,
    height: 16,
    fontSize: 10,
  },
  ratingContainer: {
    flex: 1,
    bottom: 0,
    marginTop: 4,
  },
  extraData: {
    marginHorizontal: 14,
  },
  cardDescriptionContainer: {
    flex: 4,
  },
  cardDataContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 8,
    flexDirection: "row",
  },
  cardTitles: {
    marginBottom: 4,
    alignSelf: "center",
    fontSize: 14,
    color: "#696969",
  },
  cardText: {
    alignSelf: "center",
    fontSize: 11,
    color: "#696969",
  },
  activityImage: {
    borderRadius: 2,
    flex: 1,
  },
  activityImageContainer: {
    flex: 1,
    backgroundColor: "#BCBCBC",
  },
  activityContent: {
    paddingHorizontal: 10,
    width: "100%",
    flex: 2,
    backgroundColor: "white",
  },
});

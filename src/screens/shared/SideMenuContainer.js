import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  BackHandler,
  Button,
} from "react-native";
import SideMenu from "react-native-side-menu-updated";
import Icon from "react-native-vector-icons/FontAwesome";
import { NativeHome } from "../index";
import firebase from "firebase";
import ActivityForm from "../logged/native/ActivityForm";
import TouristHome from "../logged/tourist/TouristHome";
import womanAvatar from "../../assets/womanAvatar.png";
import Modal from "react-native-modal";

export default function SideMenuContainer({ navigation }) {
  const scrollRef = useRef();
  const [sideOpen, setSideOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [currentTouristContent, setTouristContent] = useState("filtering");
  const [currentNativeContent, setNativeContent] = useState("myExperiences");
  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", () => true);
  }, []);

  //hooks de efecto para controlar el contenido que se debe mostrar en el cuerpo del
  //componente padre
  useEffect(() => {
    mainViewContent();
  }, [currentTouristContent]);

  useEffect(() => {
    mainViewContent();
  }, [refresh]);

  useEffect(() => {
    mainViewContent();
  }, [currentNativeContent]);

  useEffect(() => {
    mainViewContent();
  }, [currentNativeContent]);

  const nativeContentStateHandler = (data) => {
    setNativeContent(data);
  };
  const touristContentStateHandler = (data) => {
    setTouristContent(data);
  };
  //funcion para comprobar que tipo de usuario esta llamando al componente sideMenu
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        const dbSt = firebase.firestore();
        const experiencesRef = dbSt.collection("users").doc(user.email);
        experiencesRef
          .get()
          .then((doc) => {
            console.log("CURRENTPROFILE " + doc.data());
            if (doc.data().currentProfile === "native") {
              setCurrentProfile({ mail: user.email, type: "Nativo" });
              setCurrentContent("NativeHome");
            } else {
              setCurrentProfile({ mail: user.email, type: "Turista" });
              setCurrentContent("TouristHome");
            }
          })
          .catch((error) => {
            console.error("Error al solicitar: ", error);
          });
      } else {
        console.log("No se encontro usuario loggeado");
      }
    });
  }, []);
  function logOut() {
    var unSuscribe = firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase
          .auth()
          .signOut()
          .then(() => {
            console.log("Sign-out successful");
            navigation.reset({
              index: 0,
              routes: [{ name: "LoginScreen" }],
            });
          })
          .catch((error) => {
            console.log("Sign-out error");
            navigation.reset({
              index: 0,
              routes: [{ name: "LoginScreen" }],
            });
          });
      }
    });
    unSuscribe();
    console.log("Sesión cerrada");
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    });
  }
  function mainViewContent() {
    switch (currentContent) {
      case "NativeHome":
        return (
          <NativeHome
            navigation={navigation}
            currentNativeContent={currentNativeContent}
            setNativeContent={setNativeContent}
            handleContentState={nativeContentStateHandler}
            scrollEnd={scrollEnd}
          ></NativeHome>
        );
      case "TouristHome":
        return (
          <TouristHome
            style={{ flex: 1 }}
            handleContentState={touristContentStateHandler}
            currentTouristContent={currentTouristContent}
            setCurrentTouristContent={setTouristContent}
            scrollEnd={scrollEnd}
          ></TouristHome>
        );
      case "ActivityForm":
        return <ActivityForm></ActivityForm>;
      default:
        break;
    }
  }
  function showAddActivity() {
    if (
      currentContent === "NativeHome" &&
      currentNativeContent != "chatRooms"
    ) {
      return (
        <View style={styles.addActivityContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ActivityForm", { experience: null })
            }
            style={styles.addActivityButton}
          >
            <Icon
              style={{ alignSelf: "center" }}
              name="plus"
              size={50}
              color="#707070"
            ></Icon>
          </TouchableOpacity>
        </View>
      );
    }
  }
  function scrollEnd(width, height) {
    if (
      currentNativeContent === "chatRooms" ||
      currentTouristContent === "chatRooms"
    ) {
      if (sideOpen != true) {
        scrollRef.current.scrollToEnd({ animated: true });
      }
    }
  }
  const menu = (
    <View style={styles.sideMenu}>
      <View style={styles.sideMenuHeader}>
        <View style={styles.sideMenuAvatarContainer}>
          <Image style={styles.sideMenuAvatar} source={womanAvatar} />
        </View>
        <Text style={styles.sideMenuMailText}>{currentProfile.mail}</Text>
      </View>
      <View style={styles.sideMenuButtonsContainer}>
        <TouchableOpacity
          style={styles.sideMenuButton}
          onPress={() => {
            console.log(currentProfile);
            if (currentProfile.type === "Turista") {
              const dbSt = firebase.firestore();
              const userRef = dbSt
                .collection("users")
                .doc(currentProfile.mail.toString());
              userRef
                .collection("typeOfUser")
                .doc("tourist")
                .get()
                .then((doc) => {
                  navigation.navigate("TouristForm", {
                    editingUser: currentProfile.mail,
                    type: "tourist",
                    categories: doc.data().intrestedCategories,
                  });
                })
                .catch((error) => {
                  console.log(
                    "Error al tratar de obtener los datos de perfil previos",
                    error
                  );
                });
            } else {
              const dbSt = firebase.firestore();
              const userRef = dbSt
                .collection("users")
                .doc(currentProfile.mail.toString());
              userRef
                .collection("typeOfUser")
                .doc("native")
                .get()
                .then((doc) => {
                  navigation.navigate("NativeForm", {
                    editingUser: currentProfile.mail,
                    type: "native",
                    languages: doc.data().languages,
                    livingPlace: {
                      province: doc.data().province,
                      city: doc.data().city,
                    },
                  });
                })
                .catch((error) => {
                  console.log(
                    "Error al tratar de obtener los datos de perfil previos",
                    error
                  );
                });
            }
          }}
        >
          <Text style={styles.sideMenuButtonText}>Editar perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sideMenuButton, { borderBottomWidth: 1 }]}
          onPress={() => setModalLogoutVisible(true)}
        >
          <Text style={styles.sideMenuButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
      <Modal isVisible={modalLogoutVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalRatingView}>
            <Text style={styles.ratingTitle}>
              ¿Estás seguro de que quieres cerrar la sesión actual?
            </Text>
          </View>
          <Button
            title="Cancelar"
            onPress={() => setModalLogoutVisible(false)}
          />
          <View style={{ height: 10 }}></View>
          <Button
            title="Aceptar"
            onPress={() => {
              logOut();
              setModalLogoutVisible(false);
            }}
          />
        </View>
      </Modal>
    </View>
  );
  function showHeaderIcons() {
    return (
      <View style={styles.envelopeContainer}>
        {currentContent === "TouristHome" ? (
          <TouchableOpacity
            onPress={() => {
              setTouristContent("filtering");
            }}
            style={styles.envelopeIcon}
          >
            <Icon name="search" size={30} color="#707070"></Icon>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.envelopeIcon}>
            <Icon name="search" size={30} color="#e3e3e3"></Icon>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            if (currentContent === "TouristHome") {
              setTouristContent("followed");
            } else {
              setNativeContent("myExperiences");
            }
          }}
          style={[styles.envelopeIcon, { position: "absolute", right: 100 }]}
        >
          <Icon name="folder-open-o" size={30} color="#707070"></Icon>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (currentContent === "TouristHome") {
              setTouristContent("chatRooms");
            } else {
              setNativeContent("chatRooms");
            }
          }}
          style={[styles.envelopeIcon, { position: "absolute", right: 20 }]}
        >
          <Icon name="envelope-o" size={30} color="#707070"></Icon>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <SideMenu
      onChange={(argument) => {
        setSideOpen(argument);
      }}
      style={styles.sideMenuContainer}
      isOpen={sideOpen}
      menu={menu}
    >
      <View style={styles.container}>
        <View style={styles.scrollParent}>
          <ScrollView
            ref={scrollRef}
            onContentSizeChange={() => scrollEnd()}
            style={styles.scrollComponent}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  setSideOpen(true);
                }}
                style={styles.menuButton}
              >
                <Icon name="bars" size={40} color="#F2F2F2"></Icon>
              </TouchableOpacity>
              <View style={styles.avatarContainer}>
                <Image style={styles.avatar} source={womanAvatar} />
              </View>
            </View>
            <View style={styles.envelopeViewContainer}>
              {showHeaderIcons()}
            </View>
            {mainViewContent()}
          </ScrollView>
          {showAddActivity()}
        </View>
      </View>
    </SideMenu>
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
    height: 80,
    width: 200,
    marginBottom: 10,
    borderRadius: 2,
    backgroundColor: "white",
  },
  sideMenuButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
    borderTopWidth: 1,
    borderColor: "#696969",
  },
  sideMenuButtonsContainer: {
    flex: 4,
  },
  sideMenuAvatarContainer: {},
  sideMenuAvatar: {
    width: 60,
    height: 60,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
  },
  sideMenuHeader: {
    flex: 1,
    alignItems: "center",
  },
  sideMenuMailText: {
    marginTop: 14,
    fontWeight: "bold",
    fontSize: 16,
    color: "#696969",
  },
  sideMenuButtonText: {
    fontSize: 16,
    color: "#696969",
  },
  sideMenu: {
    flex: 1,
    paddingTop: "10%",
  },
  addActivityContainer: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "transparent",
    marginBottom: "10%",
    marginRight: 20,
    right: 8,
    width: "100%",
  },
  addActivityButton: {
    backgroundColor: "white",
    height: 66,
    width: 64,
    alignSelf: "flex-end",
    borderRadius: 80,
    borderWidth: 6,
    borderColor: "#0A75F2",
  },
  menuButton: {
    marginLeft: "10%",
    position: "absolute",
    alignSelf: "flex-start",
  },
  envelopeViewContainer: {
    backgroundColor: "#e3e3e3",
    height: 40,
    justifyContent: "center",
    marginBottom: 10,
  },
  envelopeContainer: {
    flexDirection: "row",
    marginLeft: "5%",
  },
  avatarContainer: {
    marginRight: "10%",
    position: "absolute",
    alignSelf: "flex-end",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
  },
  header: {
    justifyContent: "center",
    backgroundColor: "#0A75F2",
    height: 180,
  },
  scrollParent: {
    width: "100%",
    flex: 8,
  },
  container: {
    width: "100%",
    backgroundColor: "black",
    flex: 1,
  },
  sideMenuContainer: {
    width: "100%",
    flex: 1,
  },
  scrollComponent: {
    width: "100%",
    flex: 1,
    backgroundColor: "white",
  },
});

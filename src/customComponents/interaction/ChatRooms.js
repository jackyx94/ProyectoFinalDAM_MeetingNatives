import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import firebase from "firebase";
import Chat from "./Chat";
import manAvatar from "../../assets/manAvatar.png";

export default function ChatRooms({
  parent,
  handleChatState,
  scrollEnd,
  setNativeContent,
}) {
  const [roomslist, setRooms] = useState([]);
  const [currentContent, setCurrent] = useState(["rooms"]);

  useEffect(() => {
    console.log("FOLLOWED USEFFECT");
    //setNativeContent("myExperiences");
    retrieveChatRooms();
  }, []);
  // useEffect(() => {
  //   //mandamos el estado de los chips al componente padre para gestionar
  //   // allí los datos del formulario cada vez que se actualice la variable de estado items
  //   returnState();
  // }, [conversation]);

  function returnState(estado) {
    return handleChatState(estado);
  }
  async function retrieveChatRooms() {
    var unsuscribe = firebase.auth().onAuthStateChanged(async function (user) {
      const dbSt = firebase.firestore();
      const experiencesRef = dbSt
        .collection("openChats")
        .where(parent, "==", user.email);

      const snapshot = await experiencesRef.get();
      if (snapshot.empty) {
        //showNofoundAlert();
        console.log("No matching documents.");
        return;
      }
      snapshot.forEach((doc, index) => {
        if (user.email === doc.data().nativeMail) {
          setRooms((oldArray) => [
            ...oldArray,
            {
              id: index,
              name: doc.data().touristMail,
              image: manAvatar,
              docId: doc.id,
            },
          ]);
        } else {
          setRooms((oldArray) => [
            ...oldArray,
            {
              id: index,
              name: doc.data().nativeMail,
              image: manAvatar,
              docId: doc.id,
            },
          ]);
        }
      });
    });
    unsuscribe();
  }
  function manageContent() {
    if (currentContent[0] === "rooms") {
      return (
        <View>
          <Text style={styles.headerText}>Chats abiertos</Text>
          <View style={styles.horizontalLine}></View>
          <FlatList
            //extraData={this.state}
            data={roomslist}
            keyExtractor={(item) => {
              return item.id;
            }}
            renderItem={singleChatRoomItem}
          />
        </View>
      );
    } else {
      if (parent === "touristMail") {
        return (
          <Chat
            autoScroll={scrollEnd}
            conversationId={currentContent[1]}
            parent={"tourist"}
          ></Chat>
        );
      } else {
        return (
          <Chat
            autoScroll={scrollEnd}
            conversationId={currentContent[1]}
            parent={"native"}
          ></Chat>
        );
      }
    }
  }
  function goToChatRoom(docId) {
    setCurrent(["conversation", docId]);
  }
  const singleChatRoomItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => goToChatRoom(item.docId)}>
        <View style={styles.row}>
          <Image source={item.image} style={styles.pic} />
          <View>
            <View style={styles.nameContainer}>
              <Text
                style={styles.nameTxt}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
            </View>
            <View style={styles.msgContainer}></View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return <View style={{ flex: 1 }}>{manageContent()}</View>;
}

const styles = StyleSheet.create({
  headerText: {
    marginTop: 12,
    fontSize: 18,
    color: "#696969",
    alignSelf: "center",
  },
  horizontalLine: {
    borderColor: "#e3e3e3",
    borderBottomWidth: 2,
    marginHorizontal: 10,
    marginTop: 10,
    paddingBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#DCDCDC",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    padding: 10,
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: "600",
    color: "#222",
    fontSize: 18,
    width: 170,
  },
  mblTxt: {
    fontWeight: "200",
    color: "#777",
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  msgTxt: {
    fontWeight: "400",
    color: "#008B8B",
    fontSize: 12,
    marginLeft: 15,
  },
});

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { Dimensions } from "react-native";
import firebase from "firebase";
export default function Chat({ autoScroll, conversationId, parent }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const dbSt = firebase.firestore();

  useEffect(() => {
    if (dbSt) {
      const unSuscribe = dbSt
        .collection("openChats")
        .doc(conversationId)
        .collection("messages")
        .orderBy("sendAt", "desc")
        .limit(20)
        .onSnapshot((querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setMessages(data.reverse());
        });
      return unSuscribe;
    }
  }, [dbSt]);

  function send() {
    var user = firebase.auth().currentUser;
    const dbSt = firebase.firestore();
    const messagesRef = dbSt
      .collection("openChats")
      .doc(conversationId)
      .collection("messages")
      .add({
        value: msg,
        sendAt: firebase.firestore.FieldValue.serverTimestamp(),
        sender: parent,
      });
    setMsg("");
  }
  function goScrollBottom() {
    setTimeout(() => {
      autoScroll();
    }, 400);
  }
  const renderItem = ({ item }) => {
    if (item.sender === parent) {
      return (
        <View style={styles.rightMsg}>
          <View style={styles.rightBlock}>
            <Text style={styles.rightTxt}>{item.value}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.eachMsg}>
          <View style={styles.leftBlock}>
            <Text style={styles.msgTxt}>{item.value}</Text>
          </View>
        </View>
      );
    }
  };
  return (
    <KeyboardAvoidingView style={styles.keyboard} onFocus={goScrollBottom()}>
      <View style={{ flex: 1 }}>
        <FlatList
          style={styles.list}
          data={messages}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={renderItem}
        />
        <View style={styles.input}>
          <TextInput
            onTouchEnd={goScrollBottom()}
            onKeyPress={goScrollBottom()}
            value={msg}
            placeholderTextColor="#696969"
            onChangeText={(msg) => setMsg(msg)}
            blurOnSubmit={false}
            onSubmitEditing={() => send()}
            placeholder="Escribe un mensaje"
            returnKeyType="send"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    minHeight: windowHeight - 230,
  },
  list: {
    flex: 1,
    marginBottom: 80,
  },
  input: {
    position: "absolute",
    bottom: 10,
    flex: 1,
    justifyContent: "center",
    paddingLeft: 10,
    height: 50,
    flex: 1,
    width: "94%",
    backgroundColor: "#e3e3e3",
    margin: 10,
    borderRadius: 6,
  },
  eachMsg: {
    flexDirection: "row",
    alignItems: "flex-end",
    margin: 5,
  },
  rightMsg: {
    flexDirection: "row",
    alignItems: "flex-end",
    margin: 5,
    alignSelf: "flex-end",
  },
  userPic: {
    height: 40,
    width: 40,
    margin: 5,
    borderRadius: 20,
    backgroundColor: "#BCBCBC",
  },
  leftBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: "#ededed",
    padding: 10,
    shadowColor: "#3d3d3d",
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  rightBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: "#97c163",
    padding: 10,
    shadowColor: "#3d3d3d",
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  msgTxt: {
    fontSize: 15,
    fontWeight: "600",
  },
  rightTxt: {
    fontSize: 15,
    color: "#202020",
    fontWeight: "600",
  },
});

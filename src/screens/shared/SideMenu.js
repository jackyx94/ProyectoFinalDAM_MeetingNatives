import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";
import SideMenu from "react-native-side-menu-updated";
import Icon from "react-native-vector-icons/FontAwesome";
import { NativeHome } from "../index";
import { Chat } from "../../customComponents/interaction";

export default function SideMenuContainer({ navigation, currentContent }) {
  const [sideOpen, setSideOpen] = useState(false);
  const isFirstRender = useRef(true);

  function currentContent(currentContent) {
    if (currentContent === "NativeHome") {
      return <NativeHome navigation={navigation}></NativeHome>;
    }
    if (currentContent === "Chat") {
      return <Chat></Chat>;
    }
  }
  useEffect(() => {
    //console.log(sideOpen);
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      //setSideOpen(true);
      setSideOpen(false);
    }
  }, [sideOpen]);
  const menu = (
    <View style={styles.sideMenu}>
      <Text>Menu lateral</Text>
    </View>
  );
  return (
    <SideMenu style={styles.sideMenuContainer} isOpen={sideOpen} menu={menu}>
      <View style={styles.container}>
        <View style={styles.scrollParent}>
          <ScrollView style={styles.scrollComponent}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  //console.log(sideOpen);
                  setSideOpen((current) => !current);
                }}
                style={styles.menuButton}
              >
                <Icon name="bars" size={40} color="#707070"></Icon>
              </TouchableOpacity>
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.avatar}
                  source={require("../../assets/womanAvatar.png")}
                />
              </View>
            </View>
            <View style={styles.envelopeViewContainer}>
              <View style={styles.envelopeContainer}>
                <TouchableOpacity onPress={() => {}} style={styles.envelopes}>
                  <Icon name="envelope-o" size={30} color="#707070"></Icon>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {}} style={styles.envelopes}>
                  <Icon name="envelope-open-o" size={30} color="#707070"></Icon>
                </TouchableOpacity>
              </View>
            </View>
            {currentContent("NativeHome")}
          </ScrollView>
        </View>
      </View>
    </SideMenu>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    marginLeft: "10%",
    position: "absolute",
    alignSelf: "flex-start",
  },
  sideMenu: {
    paddingTop: "20%",
    paddingLeft: "10%",
    width: 250,
    backgroundColor: "#707070",
  },
  envelopeViewContainer: {
    paddingTop: 4,
    borderWidth: 0.5,
    height: 40,
    justifyContent: "center",
    backgroundColor: "white",
  },
  envelopeContainer: {
    flexDirection: "row-reverse",
    marginLeft: "5%",
  },
  envelopes: {
    marginLeft: 40,
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
    backgroundColor: "#00BFFF",
    height: 180,
  },
  scrollParent: {
    flex: 8,
  },
  container: {
    backgroundColor: "black",
    flex: 1,
  },
  sideMenuContainer: {},
  scrollComponent: {
    backgroundColor: "white",
  },
});

import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "./src/core/theme";
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
  ChooseScreen,
  NativeForm,
  NativeHome,
  TouristForm,
  TouristHome,
} from "./src/screens";
import ActivityForm from "./src/screens/logged/native/ActivityForm";
import { SideMenuContainer } from "./src/screens/shared";
import { FormHeader } from "./src/customComponents/form";
import initializeFirebase from "./src/databases/firebaseActions";

const Stack = createStackNavigator();

export default function App() {
  initializeFirebase();
  console.disableYellowBox = true;
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="SideMenuContainer"
            component={SideMenuContainer}
          />
          <Stack.Screen name="NativeForm" component={NativeForm} />
          <Stack.Screen name="TouristForm" component={TouristForm} />
          <Stack.Screen name="ActivityForm" component={ActivityForm} />
          <Stack.Screen name="NativeHome" component={NativeHome} />
          <Stack.Screen name="TouristHome" component={TouristHome} />
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="ChooseScreen" component={ChooseScreen} />
          <Stack.Screen name="FormHeader" component={FormHeader} />

          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

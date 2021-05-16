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
  HomeScreen,
  ChooseScreen,
  NativeForm,
  NativeHome,
  TouristForm,
} from "./src/screens";
import { SideMenuContainer } from "./src/screens/shared";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="TouristForm"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="NativeForm" component={NativeForm} />
          <Stack.Screen
            name="SideMenuContainer"
            component={SideMenuContainer}
          />
          <Stack.Screen name="TouristForm" component={TouristForm} />
          <Stack.Screen name="NativeHome" component={NativeHome} />
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="ChooseScreen" component={ChooseScreen} />
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

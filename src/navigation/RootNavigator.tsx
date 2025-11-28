import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  Theme,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import type { RootStackParamList, AppTabsParamList } from "./types";
// Ekrany
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileScreen from "../screens/ProfileScreen";
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<AppTabsParamList>();
const AppDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#0f1420",
    card: "#121a2a",
    text: "#e8eaed",
    border: "#1f2b40",
    primary: "#4c9aff",
  },
};
function AppTabsNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#121a2a" },
        headerTitleStyle: { color: "#e8eaed" },
        tabBarStyle: { backgroundColor: "#121a2a", borderTopColor: "#1f2b40" },
        tabBarActiveTintColor: "#4c9aff",
        tabBarInactiveTintColor: "#a8b0bd",
        tabBarIcon: ({ focused, color, size }) => {
          const getName = () => {
            if (route.name === "Home") {
              return focused ? "home" : "home-outline";
            }
            if (route.name === "Settings") {
              return focused ? "settings" : "settings-outline";
            }
            return "ellipse"; // fallback
          };
          return <Ionicons name={getName()} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Start" }}
      />
      <Tabs.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Ustawienia" }}
      />
    </Tabs.Navigator>
  );
}
export default function RootNavigator() {
  const isDark = true;
  const screenOptions: NativeStackNavigationOptions = {
    headerStyle: { backgroundColor: "#121a2a" },
    headerTitleStyle: { color: "#e8eaed" },
    headerTintColor: "#e8eaed",
  };
  return (
    <NavigationContainer theme={isDark ? AppDarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={screenOptions} initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Logowanie" }}
        />
        <Stack.Screen
          name="AppTabs"
          component={AppTabsNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "Profil użytkownika" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

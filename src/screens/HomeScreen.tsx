import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Platform,
} from "react-native";
import { getValueFor } from "../expoSecureStorage";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import type { RootStackParamList } from "../navigation/types";
import { useAppContext } from "../context/AppContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Tile = {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
};
export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { state } = useAppContext();
  const [userInfo, setUserInfo] = useState("");

  const getDataFromSecureStorage = async () => {
    const data = await getValueFor("loggedUser");

    setUserInfo(data);
  };

  useEffect(() => {
    getDataFromSecureStorage();
  }, []);

  const tiles: Tile[] = [
    {
      key: "profile",
      title: "Profil",
      icon: "person",
      color: "#4C9AFF",
      onPress: () => navigation.navigate("Profile", { userId: "user_123" }),
    },
    {
      key: "settings",
      title: "Ustawienia",
      icon: "settings",
      color: "#7C4DFF",
      onPress: () =>
        navigation.navigate("AppTabs", { screen: "Settings" } as never),
    },
    {
      key: "photo",
      title: "Photo Screen",
      icon: "camera",
      color: "#00C853",
      onPress: () => navigation.navigate("Photo"),
    },
    {
      key: "help",
      title: "Pomoc",
      icon: "help-circle",
      color: "#FF7043",
      onPress: () => {},
    },
  ];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Witaj {state?.displayName}</Text>
      <FlatList
        data={tiles}
        keyExtractor={(item) => item.key}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={item.onPress}
            android_ripple={{ color: "rgba(0,0,0,0.12)" }}
            style={({ pressed }) => [
              styles.tile,
              { backgroundColor: item.color },
              pressed && Platform.OS === "ios" && { opacity: 0.8 },
            ]}
          >
            <Ionicons name={item.icon} size={28} color="#FFFFFF" />
            <Text style={styles.tileText}>{item.title}</Text>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: GAP }}
      />
    </View>
  );
}
const GAP = 16;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1420", padding: 24 },
  title: {
    color: "#e8eaed",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  row: { justifyContent: "space-between", marginBottom: GAP },
  tile: {
    borderRadius: 16,
    padding: 16,
    height: 110,
    flex: 1,
    marginRight: GAP / 2,
    marginLeft: GAP / 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  tileText: { marginTop: 8, color: "#FFFFFF", fontWeight: "700" },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Switch,
  Alert,
} from "react-native";
import { storeData, getData } from "../asyncStorage";
import { save, getValueFor } from "../expoSecureStorage";
import * as LocalAuthentication from "expo-local-authentication";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { RootStackParamList } from "../navigation/types";
import { login, getUsers } from "../api/auth";
import { useAppContext } from "../context/AppContext";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;
const COLORS = {
  bg: "#0f1420",
  card: "#121a2a",
  border: "#1f2b40",
  text: "#e8eaed",
  subtext: "#a8b0bd",
  primary: "#4c9aff",
};

interface User {
  login: string;
  pass: string;
  note: string;
}

export default function LoginScreen({ navigation }: Props) {
  const [available, setAvailable] = useState(false);
  const { setDisplayName, state } = useAppContext();
  const [types, setTypes] = useState<LocalAuthentication.AuthenticationType[]>(
    [],
  );
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [users, setUsers] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const canLogin = email.trim().length > 3 && pwd.length >= 3;

  const useBio = async () => {
    getUsers().then((data) => {
      setUsers(data);
    });

    const loggedUser = await getData("loggedUser");

    console.log(loggedUser);

    if (loggedUser) {
      setDisplayName(loggedUser.login);

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Zaloguj się biometrią",
        cancelLabel: "Anuluj",
      });

      if (result.success) {
        navigation.replace("AppTabs");
      } else {
        Alert.alert("Niepowodzenie", `Błąd: ${result.error ?? "nieznany"}`);
      }
    }
  };

  useEffect(() => {
    useBio();
  }, []);

  useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supported =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      setAvailable(hasHardware && isEnrolled);
      setTypes(supported);
    })();
  }, []);

  const authenticate = async () => {
    login(email, pwd).then(async (result: User[]) => {
      if (result.length) {
        await storeData("loggedUser", result[0]);
        setDisplayName(result[0]?.login);
        navigation.replace("AppTabs");
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Ionicons
              name="sparkles-outline"
              size={28}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.title}>Zaloguj się</Text>
          <Text style={styles.subtitle}>Witaj ponownie</Text>
          <Text style={styles.subtitle}>Tutaj: {state?.displayName}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={COLORS.subtext} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#7c8799"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>
          <Text style={[styles.label, { marginTop: 14 }]}>Hasło</Text>
          <View style={styles.inputWrap}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={COLORS.subtext}
            />
            <TextInput
              style={styles.input}
              value={pwd}
              onChangeText={setPwd}
              placeholder="••••••••"
              placeholderTextColor="#7c8799"
              secureTextEntry={!showPwd}
              autoCapitalize="none"
            />
            <Pressable
              onPress={() => setShowPwd((v) => !v)}
              style={styles.iconBtn}
            >
              <Ionicons
                name={showPwd ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={COLORS.subtext}
              />
            </Pressable>
          </View>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Switch
                value={remember}
                onValueChange={setRemember}
                trackColor={{ false: "#3a455a", true: "#2e6db3" }}
                thumbColor={remember ? COLORS.primary : "#dfe3ea"}
              />
              <Text style={styles.remember}>Zapamiętaj mnie</Text>
            </View>
            <Pressable>
              <Text style={styles.forgot}>Nie pamiętasz hasła?</Text>
            </Pressable>
          </View>
          <Pressable
            onPress={authenticate}
            android_ripple={{ color: "white" }}
            style={[styles.btn, !canLogin && { opacity: 0.5 }]}
          >
            <Text style={styles.btnText}>Wejdź do aplikacji</Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.replace("AppTabs")}
            android_ripple={{ color: "rgba(255,255,255,0.08)" }}
            style={styles.btnGhost}
          >
            <Ionicons name="person-outline" size={16} color={COLORS.text} />
            <Text style={styles.btnGhostText}>Kontynuuj jako gość</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  header: { alignItems: "center", gap: 6, marginTop: 12, marginBottom: 6 },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(76,154,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(76,154,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: COLORS.text, fontSize: 22, fontWeight: "800" },
  subtitle: { color: COLORS.subtext, fontSize: 14 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 10,
  },
  label: {
    color: COLORS.subtext,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  input: { flex: 1, color: COLORS.text, fontSize: 16 },
  iconBtn: { padding: 4, borderRadius: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  remember: { color: COLORS.subtext, fontSize: 13 },
  forgot: { color: COLORS.primary, fontSize: 13, fontWeight: "700" },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    marginTop: 8,
  },
  btnText: { color: "white", fontWeight: "800", fontSize: 15 },
  btnGhost: {
    marginTop: 10,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  btnGhostText: { color: COLORS.text, fontWeight: "700" },
  orRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  line: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.08)" },
  orText: { color: COLORS.subtext, fontSize: 12 },
  socialRow: { flexDirection: "row", gap: 10 },
  socialBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  socialText: { color: COLORS.text, fontWeight: "700" },
});

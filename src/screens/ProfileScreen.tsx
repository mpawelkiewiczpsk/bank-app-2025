import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Platform,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { RootStackParamList } from "../navigation/types";
type Route = RouteProp<RootStackParamList, "Profile">;
const COLORS = {
  bg: "#0f1420",
  card: "#121a2a",
  border: "#1f2b40",
  text: "#e8eaed",
  subtext: "#a8b0bd",
  primary: "#4c9aff",
  success: "#00C853",
  warning: "#FFB300",
};
export default function ProfileScreen() {
  const route = useRoute<Route>();
  const { userId } = route.params;
  const displayName = useMemo(() => {
    const id = `${userId}`.replace(/[^a-zA-Z0-9]+/g, " ").trim();
    if (!id) return "Użytkownik";
    const parts = id.split(" ");
    if (parts.length >= 2)
      return `${capitalize(parts[0])} ${capitalize(parts[1])}`;
    return capitalize(parts[0]);
  }, [userId]);
  const initials = useMemo(() => {
    const letters = displayName
      .split(" ")
      .map((s) => s[0]?.toUpperCase())
      .filter(Boolean);
    return (letters[0] || "U") + (letters[1] || "");
  }, [displayName]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [twoFA, setTwoFA] = useState(Platform.OS === "ios");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.handle}>@{userId}</Text>
          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.buttonPrimary]}
              android_ripple={{ color: "rgba(0,0,0,0.12)" }}
            >
              <Ionicons name="create-outline" size={16} color="#0b0e13" />
              <Text style={[styles.buttonText, { color: "#0b0e13" }]}>
                Edytuj profil
              </Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonGhost]}
              android_ripple={{ color: "rgba(255,255,255,0.08)" }}
            >
              <Ionicons
                name="chatbubbles-outline"
                size={16}
                color={COLORS.text}
              />
              <Text style={styles.buttonText}>Wiadomość</Text>
            </Pressable>
          </View>
          <View style={styles.stats}>
            <Stat value="128" label="Obserwujący" />
            <Stat value="87" label="Obserwowani" />
            <Stat value="24" label="Posty" />
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informacje</Text>
          <Item icon="mail-outline" label="E-mail" value="user@example.com" />
          <Divider />
          <Item icon="call-outline" label="Telefon" value="+48 600 000 000" />
          <Divider />
          <Item icon="globe-outline" label="Strona" value="example.com" />
          <Divider />
          <Item icon="calendar-outline" label="Dołączył" value="12.03.2024" />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bezpieczeństwo</Text>
          <ToggleItem
            icon="shield-outline"
            label="Uwierzytelnianie 2FA"
            value={twoFA}
            onValueChange={setTwoFA}
          />
          <Divider />
          <ToggleItem
            icon="lock-closed-outline"
            label="Konto prywatne"
            value={isPrivate}
            onValueChange={setIsPrivate}
          />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Akcje</Text>
          <Pressable
            style={styles.rowPress}
            android_ripple={{ color: "rgba(255,255,255,0.06)" }}
          >
            <View style={styles.rowLeft}>
              <IconBadge name="share-social-outline" />
              <Text style={styles.rowLabel}>Udostępnij profil</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtext} />
          </Pressable>
          <Divider />
          <Pressable
            style={styles.rowPress}
            android_ripple={{ color: "rgba(255,255,255,0.06)" }}
          >
            <View style={styles.rowLeft}>
              <IconBadge name="download-outline" />
              <Text style={styles.rowLabel}>Pobierz dane</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtext} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
function IconBadge({ name }: { name: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.iconBadge}>
      <Ionicons name={name} size={18} color={COLORS.primary} />
    </View>
  );
}
function Item({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <IconBadge name={icon} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}
function ToggleItem({
  icon,
  label,
  value,
  onValueChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <IconBadge name={icon} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Switch
        trackColor={{ false: "#3a455a", true: "#2e6db3" }}
        thumbColor={value ? COLORS.primary : "#dfe3ea"}
        value={value}
        onValueChange={onValueChange}
      />
    </View>
  );
}
function Divider() {
  return <View style={styles.divider} />;
}
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  headerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "rgba(76,154,255,0.15)",
    borderWidth: 2,
    borderColor: "rgba(76,154,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: COLORS.primary, fontSize: 28, fontWeight: "800" },
  name: { color: COLORS.text, fontSize: 20, fontWeight: "800" },
  handle: { color: COLORS.subtext, fontSize: 14 },
  actions: { flexDirection: "row", gap: 10, marginTop: 4 },
  button: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: "transparent",
  },
  buttonGhost: {
    backgroundColor: "transparent",
    borderColor: "rgba(255,255,255,0.18)",
  },
  buttonText: { color: COLORS.text, fontWeight: "700" },
  stats: { flexDirection: "row", gap: 18, marginTop: 6 },
  stat: { alignItems: "center", paddingHorizontal: 10 },
  statValue: { color: COLORS.text, fontSize: 16, fontWeight: "800" },
  statLabel: { color: COLORS.subtext, fontSize: 12 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    overflow: "hidden",
  },
  cardTitle: {
    color: COLORS.subtext,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    paddingHorizontal: 12,
    marginBottom: 6,
    marginTop: 6,
  },
  row: {
    minHeight: 54,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowPress: {
    minHeight: 54,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(76,154,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(76,154,255,0.25)",
  },
  rowLabel: { color: COLORS.text, fontSize: 16, fontWeight: "600" },
  rowValue: { color: COLORS.subtext, fontSize: 14 },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 12,
  },
});

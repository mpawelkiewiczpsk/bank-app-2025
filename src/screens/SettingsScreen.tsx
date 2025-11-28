import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Modal,
  TouchableOpacity,
  Platform,
} from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { AppTabsParamList, RootStackParamList } from "../navigation/types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
type Route = RouteProp<AppTabsParamList, "Settings">;
type RootNav = NativeStackNavigationProp<RootStackParamList>;
const COLORS = {
  bg: "#0f1420",
  card: "#121a2a",
  border: "#1f2b40",
  text: "#e8eaed",
  subtext: "#a8b0bd",
  primary: "#4c9aff",
  accent: "#4c9aff",
  success: "#00C853",
  danger: "#ff6b6b",
  overlay: "rgba(0,0,0,0.6)",
};
export default function SettingsScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<RootNav>();
  const section = route.params?.section ?? "general";
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [faceIdEnabled, setFaceIdEnabled] = useState(Platform.OS === "ios");
  const [language, setLanguage] = useState<"pl" | "en">("pl");
  const [theme, setTheme] = useState<"system" | "light" | "dark">("dark");
  const [showLangModal, setShowLangModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const sectionTitle = useMemo(() => {
    switch (section) {
      case "general":
        return "Ustawienia ogólne";
      case "notifications":
        return "Powiadomienia";
      case "privacy":
        return "Prywatność";
      default:
        return "Ustawienia";
    }
  }, [section]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Ustawienia</Text>
        <Text style={styles.sectionHint}>{sectionTitle}</Text>
        <GroupCard title="Konto">
          <Row
            icon="person-circle"
            label="Profil użytkownika"
            value="user_123"
            onPress={() =>
              navigation.navigate("Profile", { userId: "user_123" })
            }
          />
          <Divider />
          <Row icon="key-outline" label="Zmień hasło" onPress={() => {}} />
          <Divider />
          <Row
            icon="log-out-outline"
            label="Wyloguj"
            valueStyle={{ color: COLORS.danger }}
            rightIconColor={COLORS.danger}
            rightIcon="chevron-forward"
            onPress={() => {}}
          />
        </GroupCard>
        <GroupCard title="Ogólne">
          <Row
            icon="language-outline"
            label="Język aplikacji"
            value={language === "pl" ? "Polski" : "English"}
            onPress={() => setShowLangModal(true)}
          />
          <Divider />
          <Row
            icon="color-palette-outline"
            label="Motyw"
            value={
              theme === "system"
                ? "Systemowy"
                : theme === "light"
                  ? "Jasny"
                  : "Ciemny"
            }
            onPress={() => setShowThemeModal(true)}
          />
        </GroupCard>
        <GroupCard title="Powiadomienia">
          <ToggleRow
            icon="notifications-outline"
            label="Powiadomienia push"
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
          <Divider />
          <ToggleRow
            icon="mail-unread-outline"
            label="Powiadomienia e-mail"
            value={emailEnabled}
            onValueChange={setEmailEnabled}
          />
        </GroupCard>
        <GroupCard title="Prywatność i bezpieczeństwo">
          <ToggleRow
            icon="finger-print-outline"
            label={Platform.OS === "ios" ? "Face ID" : "Biometria"}
            value={faceIdEnabled}
            onValueChange={setFaceIdEnabled}
          />
          <Divider />
          <ToggleRow
            icon="analytics-outline"
            label="Analityka użytkowania"
            caption="Anonimowe dane pomagają ulepszać aplikację"
            value={analyticsEnabled}
            onValueChange={setAnalyticsEnabled}
          />
          <Divider />
          <Row
            icon="document-lock-outline"
            label="Polityka prywatności"
            onPress={() => {}}
          />
        </GroupCard>
        <GroupCard title="O aplikacji">
          <Row icon="information-circle-outline" label="Wersja" value="1.0.0" />
          <Divider />
          <Row
            icon="chatbubbles-outline"
            label="Opinie i wsparcie"
            onPress={() => {}}
          />
        </GroupCard>
      </ScrollView>
      <PickerModal
        visible={showLangModal}
        title="Wybierz język"
        options={[
          { key: "pl", label: "Polski" },
          { key: "en", label: "English" },
        ]}
        selectedKey={language}
        onSelect={(k) => setLanguage(k as "pl" | "en")}
        onClose={() => setShowLangModal(false)}
      />
      <PickerModal
        visible={showThemeModal}
        title="Wybierz motyw"
        options={[
          { key: "system", label: "Systemowy" },
          { key: "light", label: "Jasny" },
          { key: "dark", label: "Ciemny" },
        ]}
        selectedKey={theme}
        onSelect={(k) => setTheme(k as "system" | "light" | "dark")}
        onClose={() => setShowThemeModal(false)}
      />
    </SafeAreaView>
  );
}
function GroupCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}
function Divider() {
  return <View style={styles.divider} />;
}
function Row({
  icon,
  label,
  value,
  onPress,
  rightIcon = "chevron-forward",
  rightIconColor = COLORS.subtext,
  valueStyle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  rightIconColor?: string;
  valueStyle?: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "rgba(255,255,255,0.08)" }}
      style={({ pressed }) => [
        styles.row,
        pressed && Platform.OS === "ios" && { opacity: 0.7 },
      ]}
    >
      <View style={styles.rowLeft}>
        <View style={styles.rowIconWrap}>
          <Ionicons name={icon} size={20} color={COLORS.accent} />
        </View>
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {!!value && <Text style={[styles.rowValue, valueStyle]}>{value}</Text>}
        {onPress && (
          <Ionicons name={rightIcon} size={18} color={rightIconColor} />
        )}
      </View>
    </Pressable>
  );
}
function ToggleRow({
  icon,
  label,
  caption,
  value,
  onValueChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  caption?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={styles.rowIconWrap}>
          <Ionicons name={icon} size={20} color={COLORS.accent} />
        </View>
        <View>
          <Text style={styles.rowLabel}>{label}</Text>
          {!!caption && <Text style={styles.rowCaption}>{caption}</Text>}
        </View>
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
function PickerModal({
  visible,
  title,
  options,
  selectedKey,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: { key: string; label: string }[];
  selectedKey: string;
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          {options.map((opt) => {
            const selected = opt.key === selectedKey;
            return (
              <TouchableOpacity
                key={opt.key}
                onPress={() => {
                  onSelect(opt.key);
                  onClose();
                }}
                style={styles.modalOption}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selected && { color: COLORS.primary },
                  ]}
                >
                  {opt.label}
                </Text>
                {selected && (
                  <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            onPress={onClose}
            style={styles.modalClose}
            activeOpacity={0.7}
          >
            <Text style={styles.modalCloseText}>Zamknij</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  screenTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
  },
  sectionHint: {
    color: COLORS.subtext,
    marginTop: -4,
    marginBottom: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
  },
  cardTitle: {
    color: COLORS.subtext,
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  cardBody: {
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    minHeight: 54,
    paddingHorizontal: 12,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowIconWrap: {
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
  rowCaption: { color: COLORS.subtext, fontSize: 12, marginTop: 2 },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowValue: { color: COLORS.subtext, fontSize: 14 },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 8,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  modalOption: {
    minHeight: 44,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalOptionText: {
    color: COLORS.text,
    fontSize: 15,
  },
  modalClose: {
    marginTop: 8,
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(76,154,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(76,154,255,0.25)",
  },
  modalCloseText: { color: COLORS.primary, fontWeight: "700" },
});

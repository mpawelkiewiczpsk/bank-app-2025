import React, { JSX, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    GestureResponderEvent,
} from "react-native";

export default function App(): JSX.Element {
    const [count, setCount] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [name, setName] = useState<string>("");


    let showView = true;

    const changeShowView =  () => {
        showView = !showView;

        console.log(showView);
    }

    const inc = (_e?: GestureResponderEvent) => setCount((prev) => prev + 1);
    const dec = (_e?: GestureResponderEvent) => setCount((prev) => prev - 1);
    const toggle = (_e?: GestureResponderEvent) => setIsVisible((v) => !v);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <Text style={styles.title}>Witaj{ name ? `, ${name}` : "" }!</Text>

            <TextInput
                placeholder="Podaj imię"
                placeholderTextColor="#b9c0c7"
                value={name}
                onChangeText={(val: string) => setName(val)}
                style={styles.input}
            />

            <Text style={styles.counter}>Licznik: {count}</Text>
            <View style={styles.row}>
                <TouchableOpacity style={styles.btn} onPress={dec}>
                    <Text style={styles.btnText}>−1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={inc}>
                    <Text style={styles.btnText}>+1</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.btn, styles.toggle]} onPress={changeShowView}>
                <Text style={styles.btnText}>{showView ? "Ukryj" : "Pokaż"} sekcję</Text>
            </TouchableOpacity>

            {showView ? (
                <View style={styles.card}>
                    <Text style={styles.cardText}>To jest sekcja warunkowa z showView.</Text>
                </View>
            ) : null}
        </View>
    );
}

const BG = "#101317";
const FG = "#e8eaed";
const ACCENT = "#4c9aff";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG,
        padding: 24,
        justifyContent: "center",
    },
    title: { color: FG, fontSize: 24, fontWeight: "600", marginBottom: 16 },
    input: {
        borderWidth: 1,
        borderColor: "#2a2f36",
        backgroundColor: "#171b21",
        color: FG,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    counter: { color: FG, fontSize: 20, marginBottom: 8 },
    row: { flexDirection: "row", gap: 12, marginBottom: 20 },
    btn: {
        backgroundColor: ACCENT,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    btnText: { color: "#0b0e13", fontWeight: "700", fontSize: 16, textAlign: "center" },
    toggle: { alignSelf: "flex-start", marginBottom: 16 },
    card: {
        backgroundColor: "#171b21",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#2a2f36",
    },
    cardText: { color: FG },
});

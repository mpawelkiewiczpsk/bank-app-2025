import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

const PhotoScreen: React.FC = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView | null>(null);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const askPermissions = async () => {
      if (!cameraPermission?.granted) {
        await requestCameraPermission();
      }
    };

    askPermissions();
  }, []);

  const handleTakePhoto = async () => {
    if (!cameraRef.current) {
      Alert.alert("Błąd", "Kamera nie jest gotowa");
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
        base64: true,
      });

      setPhotoUri(photo.uri);
      setPhotoBase64(photo.base64);
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się zrobić zdjęcia");
    }
  };

  const handleSaveToGallery = async () => {
    if (!photoUri) {
      Alert.alert("Brak zdjęcia", "Najpierw zrób zdjęcie");
      return;
    }

    try {
      setIsSaving(true);

      await MediaLibrary.createAssetAsync(photoUri);
      Alert.alert("Sukces", "Zdjęcie zapisane w galerii");
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się zapisać zdjęcia w galerii");
    } finally {
      setIsSaving(false);
    }
  };

  if (!cameraPermission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.infoText}>Sprawdzanie uprawnień do aparatu...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Brak uprawnień do aparatu</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestCameraPermission}
        >
          <Text style={styles.buttonText}>Nadaj uprawnienia</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {!photoUri && (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing="back"
          />
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.shutterButton}
              onPress={handleTakePhoto}
            >
              <Text style={styles.shutterText}>●</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {photoUri && (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: photoUri }}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </View>
      )}

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
          <Text style={styles.buttonText}>
            {photoUri ? "Zrób kolejne zdjęcie" : "Zrób zdjęcie"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !photoUri && styles.buttonDisabled]}
          onPress={handleSaveToGallery}
          disabled={!photoUri || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Zapisz w galerii</Text>
          )}
        </TouchableOpacity>
      </View>

      {photoBase64 && (
        <ScrollView style={styles.base64Container}>
          <Text style={styles.base64Label}>Base64 (początek):</Text>
          <Text style={styles.base64Text}>{photoBase64.slice(0, 200)}...</Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#050816",
    paddingTop: 40,
  },
  center: {
    flex: 1,
    backgroundColor: "#050816",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  infoText: {
    color: "#e5e7eb",
    marginTop: 12,
    textAlign: "center",
  },
  cameraContainer: {
    flex: 2,
    overflow: "hidden",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 16,
  },
  shutterButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  shutterText: {
    color: "#fff",
    fontSize: 32,
  },
  previewContainer: {
    flex: 2,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: 400,
    height: 400,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    minWidth: 150,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: "#f9fafb",
    fontWeight: "600",
  },
  base64Container: {
    flex: 1,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  base64Label: {
    color: "#9ca3af",
    marginBottom: 4,
  },
  base64Text: {
    color: "#e5e7eb",
    fontSize: 12,
  },
});

export default PhotoScreen;

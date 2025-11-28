import * as SecureStore from "expo-secure-store";

export async function save(key: string, value: any) {
  try {
    const jsonValue = JSON.stringify(value);
    await SecureStore.setItemAsync(key, jsonValue);
  } catch (e) {
    console.log(e);
  }
}

export async function getValueFor(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result != null ? JSON.parse(result) : null;
  } else {
    console.log("error in getValueFor");
  }
}

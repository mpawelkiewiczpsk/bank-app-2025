import React, { createContext, useContext, useMemo, useState } from "react";

export type Photo = { id: string; uri: string; createdAt: number };

export type AppState = {
  displayName: string;
  photos: Photo[];
  token?: string;
};

type AppContextValue = {
  state: AppState;
  setDisplayName: (name: string) => void;
  addPhoto: (p: Photo) => void;
  removePhoto: (id: string) => void;
  setToken: (t?: string) => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({ displayName: "", photos: [] });

  const setDisplayName = (name: string) =>
    setState((s) => ({ ...s, displayName: name }));

  const addPhoto = (p: Photo) =>
    setState((s) => ({ ...s, photos: [p, ...s.photos] }));

  const removePhoto = (id: string) =>
    setState((s) => ({ ...s, photos: s.photos.filter((x) => x.id !== id) }));

  const setToken = async (t?: string) => {
    setState((s) => ({ ...s, token: t }));
  };

  const value = useMemo(
    () => ({ state, setDisplayName, addPhoto, removePhoto, setToken }),
    [state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

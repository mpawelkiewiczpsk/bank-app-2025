export type RootStackParamList = {
  Login: undefined;
  AppTabs: undefined;
  Profile: { userId: string };
};
export type AppTabsParamList = {
  Home: undefined;
  Settings: { section?: string } | undefined; // param. opcjonalny
};

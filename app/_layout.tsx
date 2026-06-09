import { Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { ThemeProvider } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initDB } from "@/lib/database";
import { AppLightTheme, AppDarkTheme } from "@/lib/colors";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    initDB();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider
        value={colorScheme === "dark" ? AppDarkTheme : AppLightTheme}
      >
        <Stack initialRouteName="(tabs)">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="settings"
            options={{
              title: "Paramètres",
              presentation: "modal",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="task-edit"
            options={{
              title: "",
              presentation: "formSheet",
              headerShown: true,
              sheetAllowedDetents: [0.5, 1.0],
              sheetInitialDetentIndex: 0,
            }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

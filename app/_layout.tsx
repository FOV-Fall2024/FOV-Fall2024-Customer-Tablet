import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import Toast, { ToastConfigParams } from "react-native-toast-message";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { toastConfig } from "@/components/ToastConfig";
import { SignalrProvider } from "@/context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    // Khóa màn hình ở chế độ ngang khi component được mount
    async function lockOrientation() {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
      await SplashScreen.hideAsync();
    }
    lockOrientation();

    // Cleanup function để mở khóa orientation khi component bị unmount
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SignalrProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="home" />
            <Stack.Screen name="food/[id]" options={{ headerShown: true }} />
            <Stack.Screen name="payment" />
          </Stack>
          <StatusBar hidden={true} animated={true} />
          <Toast position="top" config={toastConfig} />
        </SignalrProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

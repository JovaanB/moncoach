import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthProvider";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="other"
          options={{
            title: "",
            headerShown: true,
            headerTransparent: Platform.OS === "ios",
            headerBlurEffect: "regular",
          }}
        />
      </Stack>
    </AuthProvider>
  );
}

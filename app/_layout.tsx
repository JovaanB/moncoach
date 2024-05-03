import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthProvider";
import { PaperProvider } from "react-native-paper";
import { customTheme } from "../theme";

export default function RootLayout() {
  return (
    <PaperProvider theme={customTheme}>
      <AuthProvider>
        <Stack>
          <Stack.Screen
            name="(auth)/(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(public)/signin"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(public)/signup"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}

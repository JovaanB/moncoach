import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { customTheme } from "../theme";

export default function RootLayout() {
  return (
    <PaperProvider theme={customTheme}>
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
    </PaperProvider>
  );
}

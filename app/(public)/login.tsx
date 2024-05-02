import { useEffect, useState } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as AppleAuthentication from "expo-apple-authentication";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import "core-js/stable/atob";
import { useAuth } from "../../context/AuthProvider";

export default function Login() {
  const { setUser, login } = useAuth();
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);
  const [userToken, setUserToken] =
    useState<AppleAuthentication.AppleAuthenticationCredential | null>(null);

  useEffect(() => {
    const checkAvailability = async () => {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      setAppleAuthAvailable(isAvailable);

      if (isAvailable) {
        const credential = await SecureStore.getItemAsync("apple-credentials");
        if (credential) {
          setUserToken(JSON.parse(credential));
        }
      }
    };
    checkAvailability();
  }, []);

  const getAppleAuthContent = () => {
    if (!userToken) {
      return (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={styles.button}
          onPress={login}
        />
      );
    } else {
      const decoded = jwtDecode<{
        email: string;
        exp: number;
      }>(userToken.identityToken!);

      setUser({
        email: decoded.email,
      });
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {appleAuthAvailable ? (
          getAppleAuthContent()
        ) : (
          <Text>Apple Auth not available</Text>
        )}
      </View>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 200,
    height: 44,
  },
});

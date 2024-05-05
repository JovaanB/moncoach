import { useEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as AppleAuthentication from "expo-apple-authentication";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import "core-js/stable/atob";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase.config";
import { router } from "expo-router";

export default function Signup() {
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userToken, setUserToken] =
    useState<AppleAuthentication.AppleAuthenticationCredential | null>(null);

  const signup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      router.replace("/(auth)/(tabs)");
    } catch (error) {
      console.log(error);
    }
  };

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
          style={styles.appleButton}
          onPress={() => {}}
        />
      );
    } else {
      const decoded = jwtDecode<{
        email: string;
        exp: number;
      }>(userToken.identityToken!);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TextInput
          mode="outlined"
          autoCapitalize="none"
          autoComplete="email"
          label="Email"
          inputMode="email"
          style={styles.input}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          mode="outlined"
          autoCapitalize="none"
          secureTextEntry
          autoComplete="new-password"
          label="Mot de passe"
          style={styles.input}
          onChangeText={(password) => setPassword(password)}
        />
        <Button
          icon="account-plus"
          style={styles.button}
          mode="elevated"
          disabled={!email || !password}
          onPress={() => {
            signup(email, password);
          }}
        >
          Créer un compte
        </Button>

        {appleAuthAvailable ? (
          getAppleAuthContent()
        ) : (
          <Text>Apple Auth not available</Text>
        )}

        <Text style={styles.text}>OU</Text>

        <Button
          icon="login"
          mode="contained-tonal"
          style={styles.button}
          onPress={() => {
            router.replace("/signin");
          }}
        >
          Se connecter
        </Button>
      </SafeAreaView>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    margin: 10,
  },
  appleButton: {
    height: 44,
    borderRadius: 4,
    marginTop: 4,
  },
  button: {
    marginTop: 10,
    borderRadius: 4,
  },
  input: {
    height: 40,
    borderRadius: 4,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    alignSelf: "center",
  },
});

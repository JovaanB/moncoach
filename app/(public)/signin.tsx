import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as AppleAuthentication from "expo-apple-authentication";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import "core-js/stable/atob";
import { useAuth } from "../../context/AuthProvider";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase.config";
import { Link, router } from "expo-router";
import { Button, TextInput } from "react-native-paper";

export default function Signup() {
  const { setUser, login } = useAuth();
  const [appleAuthAvailable, setAppleAuthAvailable] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userToken, setUserToken] =
    useState<AppleAuthentication.AppleAuthenticationCredential | null>(null);

  const signin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUser({ email });
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
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={styles.appleButton}
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
          secureTextEntry
          autoComplete="current-password"
          autoCapitalize="none"
          label="Mot de passe"
          style={styles.input}
          onChangeText={(password) => setPassword(password)}
        />
        <Button
          icon="login"
          style={styles.button}
          mode="elevated"
          disabled={!email || !password}
          onPress={() => {
            signin(email, password);
          }}
        >
          Se connecter
        </Button>

        {appleAuthAvailable ? (
          getAppleAuthContent()
        ) : (
          <Text>Apple Auth not available</Text>
        )}

        <Text style={styles.text}>OU</Text>

        <Button
          icon="account-plus"
          mode="contained-tonal"
          style={styles.button}
          onPress={() => {
            router.replace("/signup");
          }}
        >
          Créer un compte
        </Button>
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
  appleButton: {
    width: 200,
    height: 44,
    borderRadius: 4,
    marginTop: 4,
  },
  button: {
    width: 200,
    marginTop: 10,
    borderRadius: 4,
  },
  input: {
    height: 40,
    width: 200,
    borderRadius: 4,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
});

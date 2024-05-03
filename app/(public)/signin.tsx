import { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as AppleAuthentication from "expo-apple-authentication";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import "core-js/stable/atob";
import { useAuth } from "../../context/AuthProvider";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase.config";
import { Link } from "expo-router";

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
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          placeholder="Email"
          inputMode="email"
          style={styles.input}
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          secureTextEntry
          autoComplete="current-password"
          autoCapitalize="none"
          placeholder="Mot de passe"
          style={styles.input}
          onChangeText={(password) => setPassword(password)}
        />
        <Button
          title="Se connecter"
          onPress={() => {
            signin(email, password);
          }}
        />

        <Link style={styles.link} replace href="/signup">
          Créer un compte
        </Link>

        <Text style={styles.text}>OU</Text>

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
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
    margin: 10,
  },
});

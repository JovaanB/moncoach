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
  const { setUser } = useAuth();
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

  const login = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      setUserToken(credential);
      SecureStore.setItemAsync("apple-credentials", JSON.stringify(credential));
    } catch (e) {
      console.log(e);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("apple-credentials");
    setUserToken(null);
    setUser(null);
  };

  const refresh = async () => {
    const credential = await AppleAuthentication.refreshAsync({
      user: userToken!.user,
    });
    SecureStore.setItemAsync("apple-credentials", JSON.stringify(credential));
    setUserToken(credential);
  };

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
      }>(
        "eyJraWQiOiJCaDZIN3JIVm1iIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiaG9zdC5leHAuRXhwb25lbnQiLCJleHAiOjE3MTQ1OTc5NTQsImlhdCI6MTcxNDUxMTU1NCwic3ViIjoiMDAwODMyLjQxOTY1YWVjNDUxYTRlMDA5OGM2ODFlMTI3NDYxNDAxLjIwNDEiLCJjX2hhc2giOiJfTkYtNnZMTVYxR25kWFZ6b0I3VklRIiwiZW1haWwiOiJiaWVudmVudWpvdmFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdXRoX3RpbWUiOjE3MTQ1MTE1NTQsIm5vbmNlX3N1cHBvcnRlZCI6dHJ1ZX0.K2q3PNvN7DDIY3SbnBtvXdARmkcyuR8Hux-z40KhjaHW_ZK4ub3p532_G0wyMtzJJqGNjDaxpumnI6Mfy_aaXrWxmLhTP4pl--TA1-HcNfKw60UFgXWvleBncSj6Ko-rINJQaxlc0gkbZlylnEnQsoTIyaGv5YLyON0BQpnKxxZpB_jI5qj6XOJMp2v_REWZkFw2y7da8ZkrXqNX67EdxP70stgkYcOeG24cd0J0agwMlc7vnSd5uqAIBwyTC9UG_Hele_6aDcsWUSnFjTxV0F_KVDRFs8i1KIcAEX0wOVvW-PWH8Xpt-px0SxlwwC7UI1az8GQaCy-r1hWA64Th_g"
      );
      const current = new Date().getTime() / 1000;

      setUser({
        email: decoded.email,
      });

      return (
        <View>
          <Text>{decoded.email}</Text>
          <Text>Expired : {(current >= decoded.exp).toString()}</Text>
          <Button title="Logout" onPress={logout} />
          <Button title="Refresh" onPress={refresh} />
        </View>
      );
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

import { StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";
import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebase.config";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Accout() {
  const user = auth.currentUser;

  if (!user) {
    return null;
  }

  const { email } = user;

  return (
    <SafeAreaView style={styles.container}>
      <Text>Account</Text>
      <Text>{email}</Text>
      <Button
        style={{ marginTop: 6 }}
        mode="elevated"
        onPress={() => {
          signOut(auth);
        }}
      >
        Logout
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

import { Dimensions, StyleSheet } from "react-native";
import { Button, Card, Text } from "react-native-paper";
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
      <Text variant="headlineSmall">Mon compte</Text>
      <Text variant="bodyMedium">{email}</Text>
      <Card
        style={{
          width: Dimensions.get("window").width - 20,
          padding: 20,
          backgroundColor: "white",
          marginTop: "auto",
          borderRadius: 10,
        }}
      >
        <Button
          style={{ marginTop: 6 }}
          mode="elevated"
          onPress={() => {
            signOut(auth);
          }}
        >
          Logout
        </Button>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    marginBottom: Dimensions.get("window").height / 15,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

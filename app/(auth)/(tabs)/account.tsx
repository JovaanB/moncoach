import { Text } from "react-native";
import { useAuth } from "../../../context/AuthProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";

export default function Accout() {
  const { user, logout } = useAuth();

  return (
    <GestureHandlerRootView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Text>Account</Text>
      <Text>{user && user.email}</Text>
      <Button style={{ marginTop: 6 }} mode="elevated" onPress={logout}>
        Logout
      </Button>
    </GestureHandlerRootView>
  );
}

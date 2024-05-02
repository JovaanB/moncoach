import { Text } from "react-native";
import { useAuth } from "../../../context/AuthProvider";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";

export default function Accout() {
  const { setUser, user } = useAuth();

  return (
    <GestureHandlerRootView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Text>Account</Text>
      <Text>{user && user.email}</Text>
      <TouchableOpacity onPress={() => setUser(null)}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

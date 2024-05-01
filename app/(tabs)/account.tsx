import { View, Text, Pressable } from "react-native";
import { useAuth } from "../../context/AuthProvider";
import { Link } from "expo-router";
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
      <Text>{user && user.name}</Text>
      <Link href="/other">
        <Text>Other</Text>
      </Link>
      <TouchableOpacity onPress={() => setUser(null)}>
        <Text>Log out</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

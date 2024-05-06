import { Platform, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Tools() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title} variant="headlineLarge">
        Outils
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    padding: Platform.OS === "ios" ? 0 : 10,
    margin: Platform.OS === "ios" ? 10 : 0,
    paddingBottom: 0,
  },
  title: { marginHorizontal: 10, marginVertical: 30, alignSelf: "flex-start" },
});

import { router, useLocalSearchParams } from "expo-router";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import trainings from "../../data.json";
import { useEffect, useState } from "react";

const ONE_MINUTE_IN_MS = 60000;

export default function Training() {
  const params = useLocalSearchParams();
  const { id } = params;

  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, ONE_MINUTE_IN_MS);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const training = trainings.find((training) => training.id.toString() === id);

  if (!training) {
    return null;
  }

  const { duration, subtitle } = training;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text variant="headlineSmall">{subtitle}</Text>
        <Button
          style={{ marginLeft: "auto" }}
          mode="contained-tonal"
          onPress={() => router.back()}
        >
          Annuler
        </Button>
      </View>
      <Text variant="bodyMedium" style={{ alignSelf: "flex-start" }}>
        {time} / {duration} minutes
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 10,
    marginBottom: Dimensions.get("window").height / 15,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  titleContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

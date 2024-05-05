import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { Button, Card, IconButton, Text } from "react-native-paper";
import trainings from "../../../data.json";

export default function Home() {
  const cardGap = 10;
  const cardWidth = (Dimensions.get("window").width - cardGap * 3) / 2.1;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title} variant="headlineLarge">
        Dashboard
      </Text>

      <Button mode="contained-tonal" onPress={() => {}}>
        Commencer un entraînement vide
      </Button>

      <View style={styles.subTitleContainer}>
        <Text style={styles.subTitle} variant="titleLarge">
          Mes entraînements
        </Text>

        <IconButton icon="plus" onPress={() => {}} />
      </View>

      <ScrollView centerContent contentContainerStyle={styles.scrollContainer}>
        {trainings.length === 0 && (
          <Text variant="bodyLarge">Aucun entraînement pour le moment</Text>
        )}

        {trainings.map((training, i) => (
          <Card
            key={training.id}
            style={[
              styles.oneCard,
              {
                marginTop: cardGap,
                width: cardWidth,
              },
            ]}
          >
            <Card.Content>
              <Text variant="titleMedium">{training.title}</Text>
              <Text variant="bodyLarge">{training.subtitle}</Text>
            </Card.Content>
            <Card.Actions>
              <Text variant="bodySmall">{training.duration} min</Text>
              <IconButton size={16} icon="play" onPress={() => {}} />
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    margin: 10,
    marginBottom: Dimensions.get("window").height / 10,
  },
  title: { marginHorizontal: 10, marginVertical: 30, alignSelf: "flex-start" },
  subTitleContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subTitle: { fontWeight: "600" },
  scrollContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  oneCard: {
    borderRadius: 8,
    shadowOpacity: 0.3,
    backgroundColor: "white",
  },
});

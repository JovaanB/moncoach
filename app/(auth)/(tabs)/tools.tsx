import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const interpretImc = (imc: number) => {
  if (imc < 18.5) {
    return "Insuffisance pondérale";
  } else if (imc >= 18.5 && imc < 25) {
    return "Poids normal";
  }
  return "Surpoids";
};

export default function Tools() {
  const [poids, setPoids] = useState(0);
  const [taille, setTaille] = useState(0);
  const [imc, setImc] = useState(0);
  const [minPoids, setMinPoids] = useState(0);
  const [maxPoids, setMaxPoids] = useState(0);

  const calcul = (poids: number, taille: number) => {
    const resultImc = Math.round(poids / (taille / 100) ** 2);
    const minPoids = Math.round(18.5 * (taille / 100) ** 2);
    const maxPoids = Math.round(24.9 * (taille / 100) ** 2);

    setImc(resultImc);
    setMinPoids(minPoids);
    setMaxPoids(maxPoids);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title} variant="headlineLarge">
        Outils
      </Text>

      <Card mode="outlined">
        <Card.Content>
          <Text variant="titleMedium">IMC</Text>
          <Text variant="bodySmall">
            Calculer mon indice de masse corporelle
          </Text>

          <TextInput
            label="Taille (cm)"
            keyboardType="numeric"
            mode="outlined"
            onChange={(e) => setTaille(+e.nativeEvent.text)}
          />
          <TextInput
            label="Poids (kg)"
            keyboardType="numeric"
            mode="outlined"
            onChange={(e) => setPoids(+e.nativeEvent.text)}
          />

          {imc > 0 && (
            <View>
              <Text style={{ marginVertical: 10 }}>
                Votre IMC est de <Text variant="bodyLarge">{imc}</Text>
              </Text>
              <Text variant="bodySmall">
                Vous êtes en{" "}
                <Text variant="bodyLarge">{interpretImc(imc)}</Text>
              </Text>
              <Text variant="bodySmall">
                Votre poids idéal se situe entre{" "}
                <Text variant="bodyLarge">{minPoids} kg</Text> et{" "}
                <Text variant="bodyLarge">{maxPoids} kg</Text>
              </Text>
            </View>
          )}
        </Card.Content>
        <Card.Actions>
          <Button mode="contained-tonal" onPress={() => calcul(poids, taille)}>
            Calculer
          </Button>
        </Card.Actions>
      </Card>
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

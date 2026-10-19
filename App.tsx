import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  // Compose'daki: var sayac by remember { mutableStateOf(0) }
  const [sayac, setSayac] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>LezzetKodu Mobile 🍅</Text>
      <Text style={styles.sayi}>Sayaç: {sayac}</Text>
      <Button title="Artır" onPress={() => setSayac(sayac + 2)} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baslik: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sayi: {
    fontSize: 18,
    marginBottom: 10,
  },
});
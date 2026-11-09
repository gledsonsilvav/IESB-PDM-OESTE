import { View, Text, StyleSheet } from 'react-native';

export default function PetsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐾 Meus Pets</Text>
      <Text style={styles.subtitle}>Nenhum pet cadastrado ainda.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666' },
});
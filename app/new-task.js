import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function NewTaskModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal Nova Tarefa</Text>
      <Button title="Fechar" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
});
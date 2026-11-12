import { FlatList, StyleSheet, Text, View } from 'react-native';
import DespesaItem from './DespesaItem';

export default function DespesaLista({ despesas }) {
  if (!despesas || despesas.length === 0) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>Nenhuma despesa encontrada.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={despesas}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <DespesaItem
          descricao={item.descricao}
          valor={item.valor}
          data={item.data}
          categoria={item.categoria}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  fallbackText: {
    fontSize: 16,
    color: '#666',
  },
});
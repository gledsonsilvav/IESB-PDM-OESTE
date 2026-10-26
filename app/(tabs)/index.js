import { View, Text, FlatList, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { useNotices } from '../../hooks/useNotices';
import FadeIn from '../../components/FadeIn';

export default function HomeMural() {
  const { notices, isLoading, error, reload } = useNotices();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7209b7" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar novamente" onPress={reload} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notices}
        keyExtractor={(item) => String(item.id)}
        onRefresh={reload}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <FadeIn style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
          </FadeIn>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum aviso encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  errorText: { color: 'red', marginBottom: 12, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  cardBody: { color: '#555' },
  emptyText: { textAlign: 'center', marginTop: 20 },
});
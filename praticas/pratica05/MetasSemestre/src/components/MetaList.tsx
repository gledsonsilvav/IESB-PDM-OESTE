import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export interface Meta {
  id: string;
  texto: string;
  criadaEm: string;
  concluida: boolean;
}

interface MetaListProps {
  metas: Meta[];
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export function MetaList({ metas, onDelete, onToggle }: MetaListProps) {
  return (
    <FlatList
      data={metas}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Nenhuma meta cadastrada para este semestre.</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          {/* Toque na meta para alternar entre pendente/concluída */}
          <Pressable
            style={styles.textArea}
            onPress={() => onToggle(item.id)}
          >
            <Text style={[styles.texto, item.concluida && styles.concluidaText]}>
              {item.texto}
            </Text>
            <Text style={styles.data}>Criada em: {item.criadaEm}</Text>
          </Pressable>

          {/* Botão de remoção com feedback visual */}
          <Pressable
            style={({ pressed }) => [styles.deleteButton, pressed && styles.buttonPressed]}
            android_ripple={{ color: '#ffb3b3' }}
            onPress={() => onDelete(item.id)}
          >
            <Text style={styles.deleteText}>✕</Text>
          </Pressable>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  textArea: {
    flex: 1,
    marginRight: 10,
  },
  texto: {
    fontSize: 16,
    color: '#333',
  },
  concluidaText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  data: {
    fontSize: 11,
    color: '#AAA',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 4,
  },
  buttonPressed: {
    opacity: 0.5,
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
});
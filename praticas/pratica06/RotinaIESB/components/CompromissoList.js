import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export function CompromissoList({ itens, onDelete, onToggle, labels }) {
  return (
    <View style={styles.listContainer}>
      <Text style={styles.listTitle}>{labels.tituloLista}</Text>
      <FlatList
        data={itens}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>{labels.listaVazia}</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.cardItem}>
            <Pressable
              style={styles.textContainer}
              onPress={() => onToggle(item.id)}
            >
              <Text style={[styles.itemText, item.concluido && styles.textConcluido]}>
                {item.texto}
              </Text>
              <Text style={styles.dateText}>Criado em: {item.criadoEm}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
              android_ripple={{ color: '#ff4d4d' }}
              onPress={() => onDelete(item.id)}
            >
              <Text style={styles.deleteText}>✕</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    // flex: 1 faz a lista ocupar todo o espaco vertical restante da tela
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 14,
    fontStyle: 'italic',
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#C8102E',
    // Sombras para destaque do card
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  textConcluido: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  dateText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: '#D9534F',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.5,
  },
});
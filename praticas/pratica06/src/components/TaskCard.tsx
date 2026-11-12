import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Interface com as Props que o TaskCard recebe do componente Pai
interface TaskCardProps {
  title: string;
  onDelete: () => void;
}

export function TaskCard({ title, onDelete }: TaskCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>{title}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  cardText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  deleteButton: {
    padding: 6,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
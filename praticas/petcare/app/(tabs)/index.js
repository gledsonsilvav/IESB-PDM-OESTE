import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { getUserPets, deletePet } from '../../services/petService';

export default function HomeScreen() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const router = useRouter();

  const fetchPets = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getUserPets(user.uid);
      setPets(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a lista de pets.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, [user])
  );

  const handleDelete = (id, name) => {
    Alert.alert(
      'Remover Pet',
      `Tem certeza que deseja remover ${name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await deletePet(id);
              fetchPets();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover o pet.');
            }
          } 
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.email?.split('@')[0]} 👋</Text>
          <Text style={styles.subtitle}>Seus companheiros cadastrados</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : pets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🐾</Text>
          <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
          <Text style={styles.emptyText}>Clique no botão abaixo para adicionar seu primeiro pet.</Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push(`/pet-details/${item.id}`)}
            >
              <View style={styles.cardInfo}>
                <Text style={styles.petName}>
                  {item.type === 'Gato' ? '🐱' : '🐶'} {item.name}
                </Text>
                <Text style={styles.petDetails}>{item.breed} • {item.age} ano(s)</Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => handleDelete(item.id, item.name)}
              >
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/add-pet')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#FFF' },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666' },
  logoutButton: { padding: 8 },
  logoutText: { color: '#E53935', fontWeight: 'bold' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 20 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 },
  cardInfo: { flex: 1 },
  petName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  petDetails: { fontSize: 14, color: '#666', marginTop: 4 },
  deleteButton: { padding: 8, backgroundColor: '#FFEBEE', borderRadius: 20 },
  deleteText: { color: '#E53935', fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  emptyText: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 6 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#4CAF50', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: '#FFF', fontSize: 32, lineHeight: 32 },
});
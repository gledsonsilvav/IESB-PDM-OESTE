import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import {
  addLocation,
  getUserLocations,
  deleteLocation,
} from '../../services/locationService';

const LOCATION_TYPES = ['Clínica Vet', 'Pet Shop', 'Parque', 'Outro'];

export default function LocationsScreen() {
  const { user } = useAuth();

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Clínica Vet');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const loadLocations = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getUserLocations(user.uid);
      setLocations(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os locais favoritos.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLocations();
    }, [user])
  );

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe o nome do local.');
      return;
    }

    try {
      setSubmitting(true);
      await addLocation(user.uid, {
        name: name.trim(),
        category,
        address: address.trim(),
        phone: phone.trim(),
      });

      setName('');
      setAddress('');
      setPhone('');
      setShowForm(false);
      loadLocations();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o local.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async (id) => {
    try {
      await deleteLocation(id);
      loadLocations();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover o local.');
    }
  };

  const handleDelete = (id, itemName) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Remover "${itemName}" dos favoritos?`)) {
        confirmDelete(id);
      }
      return;
    }

    Alert.alert('Remover Local', `Remover "${itemName}" dos favoritos?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => confirmDelete(id) },
    ]);
  };

  const openInMaps = (item) => {
    const queryText = encodeURIComponent(`${item.name} ${item.address || ''}`.trim());
    const url = `https://www.google.com/maps/search/?api=1&query=${queryText}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o mapa.');
    });
  };

  const getIcon = (cat) => {
    switch (cat) {
      case 'Clínica Vet':
        return '🏥';
      case 'Pet Shop':
        return '🛍️';
      case 'Parque':
        return '🌳';
      default:
        return '📍';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Locais Favoritos</Text>
          <Text style={styles.headerSubtitle}>Clínicas, pet shops e passeios</Text>
        </View>
        <TouchableOpacity
          style={styles.toggleFormButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.toggleFormText}>{showForm ? 'Fechar' : '+ Novo'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <ScrollView style={styles.formCard}>
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.chipRow}>
            {LOCATION_TYPES.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.chip, category === item && styles.chipSelected]}
                onPress={() => setCategory(item)}
              >
                <Text
                  style={[
                    styles.chipText,
                    category === item && styles.chipTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Nome do Local *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Clínica Vet Amigo, Parque da Cidade"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Endereço (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Av. Paulista, 1000"
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.label}>Telefone / WhatsApp (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: (11) 99999-9999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Local</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : locations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📍</Text>
          <Text style={styles.emptyTitle}>Nenhum local salvo</Text>
          <Text style={styles.emptyText}>
            Clique em "+ Novo" para guardar clínicas veterinárias, pet shops ou parques favoritos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>
                  {getIcon(item.category)} {item.name}
                </Text>
                <Text style={styles.cardCategory}>{item.category}</Text>
                {item.address ? (
                  <Text style={styles.cardDetail}>📌 {item.address}</Text>
                ) : null}
                {item.phone ? (
                  <Text style={styles.cardDetail}>📞 {item.phone}</Text>
                ) : null}

                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={() => openInMaps(item)}
                >
                  <Text style={styles.mapButtonText}>Abrir no Mapa ↗</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.name)}
              >
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  headerSubtitle: { fontSize: 13, color: '#666' },
  toggleFormButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toggleFormText: { color: '#FFF', fontWeight: 'bold' },
  formCard: {
    backgroundColor: '#FFF',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    maxHeight: 360,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  label: { fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FAFAFA',
  },
  chipSelected: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  chipText: { fontSize: 13, color: '#555', fontWeight: '600' },
  chipTextSelected: { color: '#FFF' },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 16 },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardInfo: { flex: 1, paddingRight: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardCategory: { fontSize: 12, color: '#4CAF50', fontWeight: 'bold', marginTop: 2 },
  cardDetail: { fontSize: 13, color: '#666', marginTop: 4 },
  mapButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  mapButtonText: { color: '#2E7D32', fontWeight: 'bold', fontSize: 12 },
  deleteButton: { padding: 8, backgroundColor: '#FFEBEE', borderRadius: 20 },
  deleteText: { color: '#E53935', fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  emptyText: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 6 },
});
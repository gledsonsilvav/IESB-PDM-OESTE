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
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { getUserPets } from '../../services/petService';
import {
  addHealthRecord,
  getUserHealthRecords,
  deleteHealthRecord,
} from '../../services/healthService';

const CATEGORIES = ['Vacina', 'Medicamento', 'Vermífugo', 'Consulta'];

export default function HealthScreen() {
  const { user } = useAuth();

  const [pets, setPets] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedPetId, setSelectedPetId] = useState('');
  const [category, setCategory] = useState('Vacina');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const loadData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [petsData, recordsData] = await Promise.all([
        getUserPets(user.uid),
        getUserHealthRecords(user.uid),
      ]);
      setPets(petsData);
      setRecords(recordsData);
      if (petsData.length > 0 && !selectedPetId) {
        setSelectedPetId(petsData[0].id);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os registros de saúde.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [user])
  );

  const handleSave = async () => {
    if (pets.length === 0) {
      Alert.alert('Atenção', 'Cadastre um pet primeiro na aba Meus Pets.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Atenção', 'Informe o nome da vacina, medicamento ou consulta.');
      return;
    }

    const chosenPet = pets.find((p) => p.id === selectedPetId) || pets[0];

    try {
      setSubmitting(true);
      await addHealthRecord(user.uid, {
        petId: chosenPet.id,
        petName: chosenPet.name,
        category,
        title: title.trim(),
        date: date.trim() || new Date().toLocaleDateString('pt-BR'),
        notes: notes.trim(),
      });

      setTitle('');
      setDate('');
      setNotes('');
      setShowForm(false);
      loadData();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o registro.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async (id) => {
    try {
      await deleteHealthRecord(id);
      loadData();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover o registro.');
    }
  };

  const handleDelete = (id, itemTitle) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Remover o registro "${itemTitle}"?`)) {
        confirmDelete(id);
      }
      return;
    }

    Alert.alert('Remover Registro', `Remover "${itemTitle}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => confirmDelete(id) },
    ]);
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'Vacina':
        return '💉';
      case 'Medicamento':
        return '💊';
      case 'Vermífugo':
        return '🛡️';
      default:
        return '🩺';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Saúde & Cuidados</Text>
          <Text style={styles.headerSubtitle}>Histórico médico dos seus pets</Text>
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
          <Text style={styles.label}>Selecione o Pet</Text>
          {pets.length === 0 ? (
            <Text style={styles.warningText}>
              Nenhum pet encontrado. Cadastre um pet primeiro!
            </Text>
          ) : (
            <View style={styles.chipRow}>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.chip,
                    selectedPetId === pet.id && styles.chipSelected,
                  ]}
                  onPress={() => setSelectedPetId(pet.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedPetId === pet.id && styles.chipTextSelected,
                    ]}
                  >
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Categoria</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, category === cat && styles.chipSelected]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.chipText,
                    category === cat && styles.chipTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Descrição / Nome *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Vacina V10, Antirrábica, Consulta anual"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Data (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 12/11/2026"
            value={date}
            onChangeText={setDate}
          />

          <Text style={styles.label}>Observações (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Próxima dose em 30 dias"
            value={notes}
            onChangeText={setNotes}
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Registro</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : records.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>💉</Text>
          <Text style={styles.emptyTitle}>Nenhum registro de saúde</Text>
          <Text style={styles.emptyText}>
            Clique em "+ Novo" no topo para registrar vacinas, medicamentos ou consultas.
          </Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>
                  {getCategoryIcon(item.category)} {item.title}
                </Text>
                <Text style={styles.cardMeta}>
                  Pet: {item.petName} • {item.category} • {item.date}
                </Text>
                {item.notes ? (
                  <Text style={styles.cardNotes}>{item.notes}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.title)}
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
    maxHeight: 380,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  label: { fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  warningText: { color: '#E53935', fontSize: 13, marginBottom: 12 },
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
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardInfo: { flex: 1, paddingRight: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardMeta: { fontSize: 13, color: '#666', marginTop: 4 },
  cardNotes: { fontSize: 12, color: '#4CAF50', marginTop: 4, fontStyle: 'italic' },
  deleteButton: { padding: 8, backgroundColor: '#FFEBEE', borderRadius: 20 },
  deleteText: { color: '#E53935', fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  emptyText: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 6 },
});
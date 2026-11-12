import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getPetById, updatePet, deletePet } from '../../services/petService';

export default function PetDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState('Cão');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');

  useEffect(() => {
    const loadPet = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const pet = await getPetById(id);
        if (pet) {
          setName(pet.name || '');
          setType(pet.type || 'Cão');
          setBreed(pet.breed || '');
          setAge(pet.age !== undefined ? String(pet.age) : '');
          setWeight(pet.weight !== undefined ? String(pet.weight) : '');
        } else {
          Alert.alert('Aviso', 'Pet não encontrado.');
          router.back();
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do pet.');
      } finally {
        setLoading(false);
      }
    };

    loadPet();
  }, [id]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'O nome do pet não pode ficar vazio.');
      return;
    }

    try {
      setSaving(true);
      await updatePet(id, {
        name: name.trim(),
        type,
        breed: breed.trim() || 'Não informada',
        age: age ? Number(age) : 0,
        weight: weight ? Number(weight) : 0,
      });

      if (Platform.OS === 'web') {
        window.alert('Dados atualizados com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      }
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o pet.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deletePet(id);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover o pet.');
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Tem certeza que deseja excluir ${name}?`)) {
        confirmDelete();
      }
      return;
    }

    Alert.alert('Excluir Pet', `Tem certeza que deseja excluir ${name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: confirmDelete },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil do Pet 🐾</Text>

      <Text style={styles.label}>Nome *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nome do pet"
      />

      <Text style={styles.label}>Tipo de Animal</Text>
      <View style={styles.typeContainer}>
        {['Cão', 'Gato', 'Outro'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.typeButton, type === item && styles.typeButtonSelected]}
            onPress={() => setType(item)}
          >
            <Text style={[styles.typeText, type === item && styles.typeTextSelected]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Raça</Text>
      <TextInput
        style={styles.input}
        value={breed}
        onChangeText={setBreed}
        placeholder="Raça"
      />

      <Text style={styles.label}>Idade (anos)</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholder="Ex: 2"
      />

      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput
        style={styles.input}
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
        placeholder="Ex: 8.5"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={saving}>
        {saving ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={saving}>
        <Text style={styles.deleteButtonText}>Excluir Pet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  container: { padding: 24, backgroundColor: '#FFF', flexGrow: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  typeContainer: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  typeButtonSelected: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  typeText: { color: '#666', fontWeight: 'bold' },
  typeTextSelected: { color: '#FFF' },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: { color: '#E53935', fontWeight: 'bold', fontSize: 15 },
});
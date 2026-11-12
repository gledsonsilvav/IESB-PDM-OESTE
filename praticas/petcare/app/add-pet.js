import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { addPet } from '../services/petService';

export default function AddPetScreen() {
  const [name, setName] = useState('');
  const [type, setType] = useState('Cão');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o nome do pet.');
      return;
    }

    try {
      setSubmitting(true);
      await addPet(user.uid, {
        name,
        type,
        breed: breed || 'Não informada',
        age: age ? Number(age) : 0,
        weight: weight ? Number(weight) : 0,
      });

      Alert.alert('Sucesso', 'Pet cadastrado com sucesso!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o pet.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Novo Pet 🐶🐱</Text>

      <Text style={styles.label}>Nome do Pet *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Rex, Mia"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Tipo de Animal</Text>
      <View style={styles.typeContainer}>
        {['Cão', 'Gato', 'Outro'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.typeButton, type === item && styles.typeButtonSelected]}
            onPress={() => setType(item)}
          >
            <Text style={[styles.typeText, type === item && styles.typeTextSelected]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Raça</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Poodle, SRD"
        value={breed}
        onChangeText={setBreed}
      />

      <Text style={styles.label}>Idade (anos)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 2"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 8.5"
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar Pet</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#FFF', flexGrow: 1 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#4CAF50', marginBottom: 24, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  typeContainer: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  typeButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', alignItems: 'center' },
  typeButtonSelected: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  typeText: { color: '#666', fontWeight: 'bold' },
  typeTextSelected: { color: '#FFF' },
  saveButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
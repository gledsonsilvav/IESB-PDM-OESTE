import React from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface MetaInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onAdd: () => void;
}

export function MetaInput({ value, onChangeText, onAdd }: MetaInputProps) {
  const handlePress = () => {
    if (value.trim() === '') {
      const titulo = 'Atenção';
      const mensagem = 'Por favor, digite uma meta antes de adicionar.';

      if (Platform.OS === 'web') {
        alert(`${titulo}: ${mensagem}`);
      } else {
        const { Alert } = require('react-native');
        Alert.alert(titulo, mensagem);
      }
      return;
    }
    onAdd();
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Digite uma nova meta de estudo..."
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
      />
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        android_ripple={{ color: '#0056b3' }}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 10,
  },
  button: {
    width: 50,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
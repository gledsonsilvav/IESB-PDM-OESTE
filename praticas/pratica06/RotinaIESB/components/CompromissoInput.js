import React from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export function CompromissoInput({ value, onChangeText, onAdd, labels }) {
  const handlePress = () => {
    if (!value || value.trim() === '') {
      if (Platform.OS === 'web') {
        alert(`${labels.alertaAtencao}: ${labels.alertaMensagemVazia}`);
      } else {
        const { Alert } = require('react-native');
        Alert.alert(labels.alertaAtencao, labels.alertaMensagemVazia);
      }
      return;
    }
    onAdd();
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={labels.placeholderCompromisso}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
      />
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        android_ripple={{ color: '#0056b3' }}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>{labels.botaoAdicionar}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    // Layout em linha ocupando a largura do container
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    // Dimensao percentual (~70% de largura)
    width: '72%',
    height: 50,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    marginRight: '3%',
  },
  button: {
    // Dimensao percentual (~25% de largura)
    width: '25%',
    height: 50,
    backgroundColor: '#C8102E', // Cor tematica IESB
    borderRadius: 8,
    // Centralizacao explicita do conteudo interno
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
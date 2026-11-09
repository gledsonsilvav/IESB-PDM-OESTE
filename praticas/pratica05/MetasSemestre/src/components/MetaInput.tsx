import React from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LABELS } from '../constants/labels';

interface MetaInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onAdd: () => void;
}

export function MetaInput({ value, onChangeText, onAdd }: MetaInputProps) {
  const handlePress = () => {
    if (value.trim() === '') {
      if (Platform.OS === 'web') {
        alert(`${LABELS.ALERT_TITLE_ATTENTION}: ${LABELS.ALERT_MSG_EMPTY}`);
      } else {
        const { Alert } = require('react-native');
        Alert.alert(LABELS.ALERT_TITLE_ATTENTION, LABELS.ALERT_MSG_EMPTY);
      }
      return;
    }
    onAdd();
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={LABELS.INPUT_PLACEHOLDER}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
      />
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        android_ripple={{ color: '#0056b3' }}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>{LABELS.BUTTON_ADD}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    // Uso de %/flex: ocupa aproximadamente 80% do espaco horizontal
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: '3%',
  },
  button: {
    // Uso de % para fechar a largura da linha (~17%)
    width: '17%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    // justifyContent e alignItems centralizam o icone '+' no meio do botao
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
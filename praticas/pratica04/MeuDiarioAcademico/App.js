import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Pressable, 
  Switch, 
  ScrollView 
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { 
  APP_TITLE, 
  INPUT_PLACEHOLDER, 
  BUTTON_ADD_TEXT, 
  LIST_TITLE, 
  SWITCH_LABEL, 
  INITIAL_DISCIPLINES 
} from './labels';

export default function App() {
  const [isOnlyMandatory, setIsOnlyMandatory] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{APP_TITLE}</Text>
        </View>

        {/* Linha do Formulário */}
        <View style={styles.formRow}>
          <TextInput 
            style={styles.input} 
            placeholder={INPUT_PLACEHOLDER}
            placeholderTextColor="#888"
          />
          <Pressable 
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed
            ]}
          >
            <Text style={styles.buttonText}>{BUTTON_ADD_TEXT}</Text>
          </Pressable>
        </View>

        {/* Linha do Switch (Desafio) */}
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>{SWITCH_LABEL}</Text>
          <Switch 
            value={isOnlyMandatory} 
            onValueChange={setIsOnlyMandatory}
            trackColor={{ false: '#767577', true: '#6200ee' }}
          />
        </View>

        {/* Lista de Disciplinas */}
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>{LIST_TITLE}</Text>
          
          <ScrollView style={styles.scrollList}>
            {INITIAL_DISCIPLINES.map((item) => (
              <View key={item.id} style={styles.listItem}>
                <Text style={styles.listItemText}>{item.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Preenche 100% da tela disponível
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  header: {
    marginVertical: 16,
    alignItems: 'center', // Centraliza o título no eixo horizontal
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  formRow: {
    flexDirection: 'row', // Posiciona Input e Botão em linha
    justifyContent: 'space-between', // Distribui o espaço entre os elementos
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    width: '70%', // Uso de porcentagem na largura
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '27%', // Uso de porcentagem na largura
    height: 48,
    backgroundColor: '#6200ee',
    borderRadius: 8,
    justifyContent: 'center', // Centraliza o texto na vertical
    alignItems: 'center',     // Centraliza o texto na horizontal
  },
  buttonPressed: {
    backgroundColor: '#3700b3',
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  switchLabel: {
    fontSize: 14,
    color: '#555',
  },
  listContainer: {
    flex: 1, // Expande para ocupar o restante da tela
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#444',
  },
  scrollList: {
    flex: 1,
  },
  listItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
  },
});
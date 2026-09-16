import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { CompromissoInput } from './components/CompromissoInput';
import { CompromissoList } from './components/CompromissoList';
import { LABELS } from './labels';

const STORAGE_KEY = '@rotina_iesb_compromissos';

const exibirAlerta = (titulo, mensagem) => {
  if (Platform.OS === 'web') {
    alert(`${titulo}: ${mensagem}`);
  } else {
    const { Alert } = require('react-native');
    Alert.alert(titulo, mensagem);
  }
};

export default function App() {
  const [textoInput, setTextoInput] = useState('');
  const [compromissos, setCompromissos] = useState([]);
  const [isCarregado, setIsCarregado] = useState(false);

  // 1. CARREGAMENTO INICIAL: Leitura no AsyncStorage ao montar a tela
  useEffect(() => {
    async function carregarCompromissos() {
      try {
        const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY);
        if (dadosSalvos !== null) {
          setCompromissos(JSON.parse(dadosSalvos));
        }
      } catch (error) {
        exibirAlerta(LABELS.alertaErro, LABELS.alertaMensagemCarregar);
      } finally {
        setIsCarregado(true);
      }
    }
    carregarCompromissos();
  }, []);

  // 2. SALVAMENTO AUTOMÁTICO: Gravacao com dependência do estado 'compromissos'
  useEffect(() => {
    if (!isCarregado) return;

    async function salvarCompromissos() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(compromissos));
      } catch (error) {
        exibirAlerta(LABELS.alertaErro, LABELS.alertaMensagemSalvar);
      }
    }
    salvarCompromissos();
  }, [compromissos, isCarregado]);

  const handleAddCompromisso = () => {
    const novoCompromisso = {
      id: Date.now().toString(),
      texto: textoInput.trim(),
      criadoEm: new Date().toLocaleDateString('pt-BR'),
      concluido: false,
    };

    setCompromissos((listaAnterior) => [...listaAnterior, novoCompromisso]);
    setTextoInput('');
  };

  const handleDeleteCompromisso = (id) => {
    setCompromissos((listaAnterior) => listaAnterior.filter((item) => item.id !== id));
  };

  const handleToggleCompromisso = (id) => {
    setCompromissos((listaAnterior) =>
      listaAnterior.map((item) =>
        item.id === id ? { ...item, concluido: !item.concluido } : item
      )
    );
  };

  const pendentes = compromissos.filter((c) => !c.concluido).length;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Image
            source={require('./assets/logo.png')}
            style={styles.logo}
          />
          <View>
            <Text style={styles.title}>{LABELS.tituloApp}</Text>
            <Text style={styles.counter}>{pendentes} pendentes</Text>
          </View>
        </View>

        {/* Formulário de Cadastro */}
        <CompromissoInput
          value={textoInput}
          onChangeText={setTextoInput}
          onAdd={handleAddCompromisso}
          labels={LABELS}
        />

        {/* Lista de Compromissos */}
        <CompromissoList
          itens={compromissos}
          onDelete={handleDeleteCompromisso}
          onToggle={handleToggleCompromisso}
          labels={LABELS}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    // Ocupa 100% da tela verticalmente
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    // Posicionamento horizontal dos itens do topo
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
  logo: {
    width: 45,
    height: 45,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#C8102E',
  },
  counter: {
    fontSize: 14,
    color: '#666',
  },
});
import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Switch, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { MetaInput } from './src/components/MetaInput';
import { Meta, MetaList } from './src/components/MetaList';
import { LABELS } from './src/constants/labels';

const STORAGE_KEY = '@metas_semestre';

// Exibe alerta nativo no celular ou window.alert no navegador (compatibilidade universal)
const exibirAlerta = (titulo: string, mensagem: string) => {
  if (Platform.OS === 'web') {
    alert(`${titulo}: ${mensagem}`);
  } else {
    const { Alert } = require('react-native');
    Alert.alert(titulo, mensagem);
  }
};

export default function App() {
  const [textoInput, setTextoInput] = useState<string>('');
  const [metas, setMetas] = useState<Meta[]>([]);
  const [isCarregado, setIsCarregado] = useState<boolean>(false);
  const [apenasPendentes, setApenasPendentes] = useState<boolean>(false);

  // 1. CARREGAMENTO INICIAL: Leitura no AsyncStorage ao montar o app
  useEffect(() => {
    async function carregarMetas() {
      try {
        const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY);
        if (dadosSalvos !== null) {
          setMetas(JSON.parse(dadosSalvos));
        }
      } catch (error) {
        exibirAlerta(LABELS.ALERT_TITLE_ERROR, LABELS.ALERT_MSG_LOAD_ERROR);
      } finally {
        setIsCarregado(true);
      }
    }
    carregarMetas();
  }, []);

  // 2. SALVAMENTO AUTOMÁTICO: Gravacao sempre que a lista 'metas' mudar
  useEffect(() => {
    if (!isCarregado) return; // Impedir que sobrescreva com array vazio antes do carregamento

    async function salvarMetas() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(metas));
      } catch (error) {
        exibirAlerta(LABELS.ALERT_TITLE_ERROR, LABELS.ALERT_MSG_SAVE_ERROR);
      }
    }
    salvarMetas();
  }, [metas, isCarregado]);

  // Adiciona nova meta com id unico gerado por Date.now()
  const handleAddMeta = () => {
    const novaMeta: Meta = {
      id: Date.now().toString(),
      texto: textoInput.trim(),
      criadaEm: new Date().toLocaleDateString('pt-BR'),
      concluida: false,
    };

    setMetas((listaAnterior) => [...listaAnterior, novaMeta]);
    setTextoInput('');
  };

  // Remocao de meta com imutabilidade (.filter)
  const handleDeleteMeta = (id: string) => {
    setMetas((listaAnterior) => listaAnterior.filter((item) => item.id !== id));
  };

  // Alternar status de concluida
  const handleToggleMeta = (id: string) => {
    setMetas((listaAnterior) =>
      listaAnterior.map((item) =>
        item.id === id ? { ...item, concluida: !item.concluida } : item
      )
    );
  };

  // Filtro dinamico acionado pelo Switch
  const metasExibidas = apenasPendentes
    ? metas.filter((m) => !m.concluida)
    : metas;

  const concluidas = metas.filter((m) => m.concluida).length;
  const pendentes = metas.length - concluidas;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Cabecalho */}
        <View style={styles.header}>
          <Image
            source={require('./assets/target.png')}
            style={styles.logo}
          />
          <View>
            <Text style={styles.title}>{LABELS.APP_TITLE}</Text>
            <Text style={styles.counter}>
              {pendentes} pendentes / {concluidas} concluídas
            </Text>
          </View>
        </View>

        {/* Componente Form/Input */}
        <MetaInput
          value={textoInput}
          onChangeText={setTextoInput}
          onAdd={handleAddMeta}
        />

        {/* Switch de Filtro (Desafio Extra) */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>{LABELS.SWITCH_LABEL}</Text>
          <Switch
            value={apenasPendentes}
            onValueChange={setApenasPendentes}
            thumbColor={apenasPendentes ? '#007AFF' : '#f4f3f4'}
          />
        </View>

        {/* Lista de Metas */}
        <MetaList
          metas={metasExibidas}
          onDelete={handleDeleteMeta}
          onToggle={handleToggleMeta}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1 faz o container ocupar 100% do espaco vertical disponivel da tela
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    // flexDirection: 'row' posiciona a imagem e os textos lado a lado na horizontal
    flexDirection: 'row',
    // alignItems: 'center' alinha verticalmente o icone com o bloco de texto ao centro
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  counter: {
    fontSize: 14,
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between' empurra o texto para a esquerda e o Switch para a direita
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  filterLabel: {
    fontSize: 14,
    color: '#555',
  },
});
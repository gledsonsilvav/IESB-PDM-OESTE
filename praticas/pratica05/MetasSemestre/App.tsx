import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { MetaInput } from './src/components/MetaInput';
import { Meta, MetaList } from './src/components/MetaList';

const STORAGE_KEY = '@metas_semestre';

// Exibe alerta nativo no celular ou window.alert no navegador
const exibirAlerta = (titulo: string, mensagem: string) => {
  if (Platform.OS === 'web') {
    alert(`${titulo}: ${mensagem}`);
  } else {
    // Importacao dinamica do Alert apenas para plataformas nativas (iOS/Android)
    const { Alert } = require('react-native');
    Alert.alert(titulo, mensagem);
  }
};

export default function App() {
  const [textoInput, setTextoInput] = useState<string>('');
  const [metas, setMetas] = useState<Meta[]>([]);
  const [isCarregado, setIsCarregado] = useState<boolean>(false);

  // 1. CARREGAMENTO INICIAL: Leitura no AsyncStorage ao montar o app
  useEffect(() => {
    async function carregarMetas() {
      try {
        const dadosSalvos = await AsyncStorage.getItem(STORAGE_KEY);
        if (dadosSalvos !== null) {
          setMetas(JSON.parse(dadosSalvos));
        }
      } catch (error) {
        exibirAlerta('Erro', 'Não foi possível carregar as metas salvas.');
      } finally {
        setIsCarregado(true);
      }
    }
    carregarMetas();
  }, []);

  // 2. SALVAMENTO AUTOMÁTICO: Gravacao sempre que a lista 'metas' mudar
  useEffect(() => {
    if (!isCarregado) return; // Trava de segurança para evitar gravar lista vazia no carregamento

    async function salvarMetas() {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(metas));
      } catch (error) {
        exibirAlerta('Erro', 'Falha ao salvar as metas no armazenamento do dispositivo.');
      }
    }
    salvarMetas();
  }, [metas, isCarregado]);

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

  const handleDeleteMeta = (id: string) => {
    setMetas((listaAnterior) => listaAnterior.filter((item) => item.id !== id));
  };

  const handleToggleMeta = (id: string) => {
    setMetas((listaAnterior) =>
      listaAnterior.map((item) =>
        item.id === id ? { ...item, concluida: !item.concluida } : item
      )
    );
  };

  const concluidas = metas.filter((m) => m.concluida).length;
  const pendentes = metas.length - concluidas;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('./assets/target.png')}
            style={styles.logo}
          />
          <View>
            <Text style={styles.title}>Metas do Semestre</Text>
            <Text style={styles.counter}>
              {pendentes} pendentes / {concluidas} concluídas
            </Text>
          </View>
        </View>

        <MetaInput
          value={textoInput}
          onChangeText={setTextoInput}
          onAdd={handleAddMeta}
        />

        <MetaList
          metas={metas}
          onDelete={handleDeleteMeta}
          onToggle={handleToggleMeta}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
});
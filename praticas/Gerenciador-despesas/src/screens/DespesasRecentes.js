import { useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import DespesaSaida from '../components/despesa/DespesaSaida';

const CATEGORIAS = ['Todas', 'Alimentação', 'Transporte', 'Lazer', 'Contas']; //[cite: 2]

const DESPESAS_MOCK = [
  { id: 'd1', descricao: 'Almoço', valor: 45.50, data: '2026-10-01', categoria: 'Alimentação' },
  { id: 'd2', descricao: 'Uber', valor: 25.00, data: '2026-10-02', categoria: 'Transporte' },
  { id: 'd3', descricao: 'Conta de Luz', valor: 180.00, data: '2026-10-03', categoria: 'Contas' },
  { id: 'd4', descricao: 'Cinema', valor: 35.00, data: '2026-10-04', categoria: 'Lazer' },
];

export default function DespesasRecentes() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas');

  // Filtragem utilizando .filter()[cite: 2]
  const despesasExibidas = categoriaSelecionada === 'Todas'
    ? DESPESAS_MOCK
    : DESPESAS_MOCK.filter(item => item.categoria === categoriaSelecionada);

  return (
    <View style={styles.container}>
      <View style={styles.filtroContainer}>
        {CATEGORIAS.map((cat) => (
          <Pressable
            key={cat}
            style={[
              styles.filtroBotao,
              categoriaSelecionada === cat && styles.filtroAtivo,
            ]}
            onPress={() => setCategoriaSelecionada(cat)}
          >
            <Text
              style={[
                styles.filtroTexto,
                categoriaSelecionada === cat && styles.filtroTextoAtivo,
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>
      <DespesaSaida despesas={despesasExibidas} periodo="Últimos 7 Dias" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  filtroBotao: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  filtroAtivo: {
    backgroundColor: '#4c0175',
  },
  filtroTexto: {
    fontSize: 12,
    color: '#333',
  },
  filtroTextoAtivo: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
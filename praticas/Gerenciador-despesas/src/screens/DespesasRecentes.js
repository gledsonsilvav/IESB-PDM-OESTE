import { useState, useContext } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import DespesaSaida from '../components/despesa/DespesaSaida';
import { DespesasContext } from '../store/despesas-context';

const CATEGORIAS = ['Todas', 'Alimentação', 'Transporte', 'Lazer', 'Contas'];

export default function DespesasRecentes() {
  const despesasCtx = useContext(DespesasContext);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas');

  const despesasExibidas = categoriaSelecionada === 'Todas'
    ? despesasCtx.despesas
    : despesasCtx.despesas.filter(item => item.categoria === categoriaSelecionada);

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
    backgroundColor: '#F8FAFC',
  },
  filtroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filtroBotao: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filtroAtivo: {
    backgroundColor: '#0F172A',
  },
  filtroTexto: {
    fontSize: 12,
    color: '#475569',
  },
  filtroTextoAtivo: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
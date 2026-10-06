import { StyleSheet, Text, View } from 'react-native';

export default function DespesaItem({ descricao, valor, data, categoria }) {
  const dataFormatada = new Date(data).toLocaleDateString('pt-BR');

  return (
    <View style={styles.itemContainer}>
      <View style={styles.infoLeft}>
        <Text style={styles.descricao}>{descricao}</Text>
        <View style={styles.detalhesRow}>
          <Text style={styles.dataText}>{dataFormatada}</Text>
          <View style={styles.badgeCategoria}>
            <Text style={styles.categoriaText}>{categoria || 'Sem Categoria'}</Text>
          </View>
        </View>
      </View>
      <View style={styles.valorContainer}>
        <Text style={styles.valorText}>R$ {Number(valor).toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    elevation: 2,
  },
  infoLeft: {
    flex: 1,
  },
  descricao: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  detalhesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dataText: {
    fontSize: 12,
    color: '#666',
  },
  badgeCategoria: {
    backgroundColor: '#e0e0e0', // Fundo cinza claro
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12, // Bordas arredondadas
  },
  categoriaText: {
    fontSize: 10,
    color: '#333',
    fontWeight: '500',
  },
  valorContainer: {
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  valorText: {
    color: '#4c0175',
    fontWeight: 'bold',
  },
});
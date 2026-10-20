import { StyleSheet, Text, View } from 'react-native';

export default function DespesaItem({ descricao, valor, data, categoria }) {
  // Tratamento seguro de data compatível com Web e Mobile
  function formatarData(dataInput) {
    if (!dataInput) return '';
    
    const d = new Date(dataInput);
    if (isNaN(d.getTime())) return String(dataInput); // Fallback caso ocorra erro no parse

    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  return (
    <View style={styles.itemContainer}>
      <View style={styles.infoLeft}>
        <Text style={styles.descricao}>{descricao}</Text>
        <View style={styles.detalhesRow}>
          <Text style={styles.dataText}>{formatarData(data)}</Text>
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
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoLeft: {
    flex: 1,
  },
  descricao: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#0F172A',
  },
  detalhesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dataText: {
    fontSize: 12,
    color: '#64748B',
  },
  badgeCategoria: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoriaText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },
  valorContainer: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  valorText: {
    color: '#0284C7',
    fontWeight: 'bold',
  },
});
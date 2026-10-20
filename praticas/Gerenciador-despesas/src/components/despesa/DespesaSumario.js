import { StyleSheet, Text, View } from 'react-native';

export default function DespesaSumario({ despesas, periodo }) {
  // Cálculo do total utilizando .reduce()
  const somaDespesas = despesas.reduce((acumulador, item) => acumulador + Number(item.valor), 0);

  // Desafio Extra: destaque em vermelho se ultrapassar R$ 200,00
  const isValorAlto = somaDespesas > 200;

  return (
    <View style={styles.container}>
      <Text style={styles.periodo}>{periodo}</Text>
      <Text style={[styles.total, isValorAlto && styles.totalAlto]}>
        R$ {somaDespesas.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#e4d9fd',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  periodo: {
    fontSize: 14,
    color: '#4c0175',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4c0175',
  },
  totalAlto: {
    color: '#c62828', // Vermelho para alerta de gasto > 200
  },
});
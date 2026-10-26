import { View, Text, Button, Share, StyleSheet } from 'react-native';
import { useExpenses } from '../../store/expenses-context';

export default function WalletScreen() {
  const { expenses } = useExpenses();

  const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const formattedTotal = total.toFixed(2);

  function handleShare() {
    Share.share({
      message: `Gastei R$ ${formattedTotal} neste semestre.`,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Total gasto:</Text>
      <Text style={styles.amount}>R$ {formattedTotal}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Compartilhar resumo" onPress={handleShare} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  label: { fontSize: 18, color: '#666' },
  amount: { fontSize: 36, fontWeight: 'bold', color: '#7209b7', marginVertical: 12 },
  buttonContainer: { marginTop: 16 },
});
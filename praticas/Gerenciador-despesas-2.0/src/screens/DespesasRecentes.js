import React, { useMemo } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { useExpenses } from '../store/expenses-context';
import { DespesaLista } from '../components/despesa/DespesaLista';
import { GlobalStyles } from '../constants/theme';

export default function DespesasRecentes() {
  const { expenses } = useExpenses();
  const scheme = useColorScheme();
  const theme = GlobalStyles.colors[scheme === 'dark' ? 'dark' : 'light'];

  const recentExpenses = useMemo(() => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= sevenDaysAgo && expenseDate <= today;
    });
  }, [expenses]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <DespesaLista
        expenses={recentExpenses}
        fallbackText="Nenhuma despesa registrada nos últimos 7 dias."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
});
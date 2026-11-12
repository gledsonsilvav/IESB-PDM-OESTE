import React, { useMemo, useState } from 'react';
import { View, TextInput, StyleSheet, useColorScheme } from 'react-native';
import { useExpenses } from '../store/expenses-context';
import { DespesaLista } from '../components/despesa/DespesaLista';
import { useDebounce } from '../hooks/useDebounce';
import { GlobalStyles } from '../constants/theme';

export default function TodasDespesas() {
  const { expenses } = useExpenses();
  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 300);
  const scheme = useColorScheme();
  const theme = GlobalStyles.colors[scheme === 'dark' ? 'dark' : 'light'];

  const filteredExpenses = useMemo(() => {
    if (!debouncedSearch.trim()) return expenses;
    return expenses.filter((e) =>
      e.description.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [expenses, debouncedSearch]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextInput
        style={[
          styles.searchInput,
          { color: theme.text, borderColor: theme.border, backgroundColor: theme.card },
        ]}
        placeholder="Buscar por descrição..."
        placeholderTextColor={theme.subtext}
        value={searchText}
        onChangeText={setSearchText}
      />
      <DespesaLista expenses={filteredExpenses} fallbackText="Nenhuma despesa encontrada." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  searchInput: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12 },
});
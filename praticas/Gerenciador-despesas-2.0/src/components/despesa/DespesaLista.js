import React from 'react';
import { FlatList, Text, View, StyleSheet, useColorScheme, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DespesaItem from './DespesaItem';
import DespesaSumario from './DespesaSumario';
import { GlobalStyles } from '../../constants/theme';

export function DespesaLista({ expenses, fallbackText }) {
  const scheme = useColorScheme();
  const theme = GlobalStyles.colors[scheme === 'dark' ? 'dark' : 'light'];
  const { width } = useWindowDimensions();
  const numColumns = width > 600 ? 2 : 1;

  const totalSum = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <FlatList
      key={numColumns}
      data={expenses}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      ListHeaderComponent={
        <DespesaSumario count={expenses.length} total={totalSum} />
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="wallet-outline" size={48} color={theme.subtext} />
          <Text style={[styles.emptyText, { color: theme.subtext }]}>
            {fallbackText || 'Nenhuma despesa encontrada. Toque em + para adicionar.'}
          </Text>
        </View>
      }
      renderItem={({ item }) => <DespesaItem expense={item} />}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: { padding: 32, alignItems: 'center', justifyContent: 'center' },
  emptyText: { marginTop: 12, textAlign: 'center', fontSize: 16 },
});
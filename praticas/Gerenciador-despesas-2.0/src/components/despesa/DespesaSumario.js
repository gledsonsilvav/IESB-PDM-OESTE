import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { GlobalStyles } from '../../constants/theme';

export default function DespesaSumario({ count, total }) {
  const scheme = useColorScheme();
  const theme = GlobalStyles.colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.period, { color: theme.subtext }]}>
        {count} {count === 1 ? 'despesa' : 'despesas'}
      </Text>
      <Text style={[styles.sum, { color: theme.text }]}>
        R$ {Number(total).toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  period: { fontSize: 14, fontWeight: 'bold' },
  sum: { fontSize: 16, fontWeight: 'bold' },
});
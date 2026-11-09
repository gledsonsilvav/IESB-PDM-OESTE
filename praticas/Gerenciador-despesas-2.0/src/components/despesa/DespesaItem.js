import React from 'react';
import { Pressable, Text, View, StyleSheet, Platform, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyles } from '../../constants/theme';

export default function DespesaItem({ expense }) {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const theme = GlobalStyles.colors[scheme === 'dark' ? 'dark' : 'light'];

  function handlePress() {
    navigation.navigate('GerenciarDespesa', { expenseId: expense.id });
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.card },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.info}>
        <Text style={[styles.description, { color: theme.text }]}>{expense.description}</Text>
        <Text style={[styles.category, { color: theme.subtext }]}>
          {expense.category} - {new Date(expense.date).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>R$ {Number(expense.amount).toFixed(2)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  pressed: { opacity: 0.75 },
  info: { flex: 1 },
  description: { fontSize: 16, fontWeight: 'bold' },
  category: { fontSize: 12, marginTop: 4 },
  amountContainer: {
    backgroundColor: GlobalStyles.colors.primary500,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  amount: { color: '#fff', fontWeight: 'bold' },
});
import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  useColorScheme,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '../store/expenses-context';
import { GlobalStyles } from '../constants/theme';

const CATEGORIES = ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Outros'];

export default function GerenciarDespesa({ route, navigation }) {
  const expenseId = route.params?.expenseId;
  const isEditing = !!expenseId;
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const scheme = useColorScheme();
  const theme = GlobalStyles.colors[scheme === 'dark' ? 'dark' : 'light'];

  const selectedExpense = expenses.find((e) => e.id === expenseId);

  const [form, setForm] = useState({
    description: selectedExpense ? selectedExpense.description : '',
    amount: selectedExpense ? String(selectedExpense.amount) : '',
    date: selectedExpense ? new Date(selectedExpense.date) : new Date(),
    category: selectedExpense ? selectedExpense.category : '',
  });

  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar despesa' : 'Nova despesa',
    });
  }, [navigation, isEditing]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }

  function handleAmountChange(text) {
    if (/^\d*\.?\d{0,2}$/.test(text)) {
      handleChange('amount', text);
    }
  }

  function validate() {
    const newErrors = {};
    if (!form.description || form.description.trim().length < 3) {
      newErrors.description = 'A descrição deve ter no mínimo 3 caracteres.';
    }
    const parsedAmount = parseFloat(form.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'O valor deve ser maior que zero.';
    }
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (form.date > today) {
      newErrors.date = 'A data não pode ser futura.';
    }
    if (!form.category) {
      newErrors.category = 'Selecione uma categoria.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!validate()) return;

    const expenseData = {
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      date: form.date.toISOString(),
      category: form.category,
    };

    if (isEditing) {
      updateExpense(expenseId, expenseData);
    } else {
      addExpense(expenseData);
    }
    navigation.goBack();
  }

  function handleDelete() {
    Alert.alert('Excluir Despesa', 'Tem certeza que deseja remover esta despesa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          deleteExpense(expenseId);
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Descrição</Text>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, borderColor: errors.description ? theme.error : theme.border },
            ]}
            value={form.description}
            onChangeText={(val) => handleChange('description', val)}
            placeholder="Ex: Supermercado"
            placeholderTextColor={theme.subtext}
          />
          {errors.description && <Text style={[styles.errorText, { color: theme.error }]}>{errors.description}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Valor (R$)</Text>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, borderColor: errors.amount ? theme.error : theme.border },
            ]}
            value={form.amount}
            onChangeText={handleAmountChange}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={theme.subtext}
          />
          {errors.amount && <Text style={[styles.errorText, { color: theme.error }]}>{errors.amount}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Data</Text>
          <TouchableOpacity
            style={[styles.input, { borderColor: errors.date ? theme.error : theme.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: theme.text }}>{form.date.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
          {errors.date && <Text style={[styles.errorText, { color: theme.error }]}>{errors.date}</Text>}
          {showDatePicker && (
            <DateTimePicker
              value={form.date}
              mode="date"
              display="default"
              onChange={(evt, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) handleChange('date', selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Categoria</Text>
          <TouchableOpacity
            style={[styles.input, { borderColor: errors.category ? theme.error : theme.border }]}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={{ color: form.category ? theme.text : theme.subtext }}>
              {form.category || 'Selecione uma categoria'}
            </Text>
          </TouchableOpacity>
          {errors.category && <Text style={[styles.errorText, { color: theme.error }]}>{errors.category}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={[styles.buttonText, { marginLeft: 8 }]}>Excluir</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal visible={showCategoryModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Selecione a Categoria</Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryOption}
                  onPress={() => {
                    handleChange('category', item);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text style={{ color: theme.text, fontSize: 16 }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  errorText: { fontSize: 12, marginTop: 4 },
  buttonContainer: { marginTop: 20, gap: 12 },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  saveButton: { backgroundColor: GlobalStyles.colors.primary500 },
  deleteButton: { backgroundColor: '#dc3545' },
  cancelButton: { backgroundColor: '#6c757d', marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, maxHeight: '50%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  categoryOption: { paddingVertical: 12, borderBottomWidth: 0.5, borderColor: '#ccc' },
});
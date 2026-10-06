import { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DespesasContext } from '../store/despesas-context';

const CATEGORIAS = ['Alimentação', 'Transporte', 'Lazer', 'Contas'];

export default function GerenciarDespesa({ navigation }) {
  const despesasCtx = useContext(DespesasContext);

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  function valorChangeHandler(enteredText) {
    if (/^\d*\.?\d{0,2}$/.test(enteredText)) {
      setValor(enteredText);
    }
  }

  function submeterHandler() {
    if (!descricao.trim() || !valor || !categoria) {
      Alert.alert('Dados Inválidos', 'Por favor, preencha a descrição, o valor e selecione uma categoria.');
      return;
    }

    // Adiciona a nova despesa no contexto global
    despesasCtx.adicionarDespesa({
      descricao: descricao,
      valor: +valor,
      data: data.toISOString(),
      categoria: categoria,
    });

    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descrição</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Ex: Mercado" />

      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={valor}
        onChangeText={valorChangeHandler}
        placeholder="0.00"
      />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.categoriasContainer}>
        {CATEGORIAS.map((cat) => (
          <Pressable
            key={cat}
            style={[styles.categoriaItem, categoria === cat && styles.categoriaSelecionada]}
            onPress={() => setCategoria(cat)}
          >
            <Text style={[styles.categoriaText, categoria === cat && styles.categoriaTextSelecionada]}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Data</Text>
      <Pressable style={styles.datePickerBtn} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{data.toLocaleDateString('pt-BR')}</Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={data}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setData(selectedDate);
          }}
        />
      )}

      <Pressable style={styles.submitBtn} onPress={submeterHandler}>
        <Text style={styles.submitText}>Salvar Despesa</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 14,
    color: '#334155',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#F8FAFC',
  },
  categoriasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoriaItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  categoriaSelecionada: {
    backgroundColor: '#0F172A',
  },
  categoriaText: {
    color: '#475569',
  },
  categoriaTextSelecionada: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  datePickerBtn: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  dateText: {
    fontSize: 16,
    color: '#0F172A',
  },
  submitBtn: {
    marginTop: 28,
    backgroundColor: '#0284C7',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
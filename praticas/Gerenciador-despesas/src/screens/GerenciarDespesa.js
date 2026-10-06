import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const CATEGORIAS = ['Alimentação', 'Transporte', 'Lazer', 'Contas']; //[cite: 2]

export default function GerenciarDespesa({ navigation }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState(''); //[cite: 2]
  const [data, setData] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Regex para limitar a duas casas decimais[cite: 2]
  function valorChangeHandler(enteredText) {
    if (/^\d*\.?\d{0,2}$/.test(enteredText)) {
      setValor(enteredText);
    }
  }

  function submeterHandler() {
    // Validação de preenchimento dos campos obrigatórios[cite: 2]
    if (!descricao.trim() || !valor || !categoria) {
      Alert.alert('Dados Inválidos', 'Por favor, preencha descrição, valor e selecione uma categoria.');
      return;
    }

    // Processamento da submissão
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Descrição</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Ex: Mercado" />

      <Text style={styles.label}>Valor (R$)</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad" //[cite: 2]
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
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
  },
  categoriasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoriaItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  categoriaSelecionada: {
    backgroundColor: '#4c0175',
  },
  categoriaText: {
    color: '#333',
  },
  categoriaTextSelecionada: {
    color: '#fff',
    fontWeight: 'bold',
  },
  datePickerBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
  },
  submitBtn: {
    marginTop: 24,
    backgroundColor: '#4c0175',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
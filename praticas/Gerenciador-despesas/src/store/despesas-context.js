import { createContext, useState } from 'react';

const DESPESAS_INICIAIS = [
  { id: 'd1', descricao: 'Almoço', valor: 45.50, data: new Date('2026-10-01').toISOString(), categoria: 'Alimentação' },
  { id: 'd2', descricao: 'Uber', valor: 25.00, data: new Date('2026-10-02').toISOString(), categoria: 'Transporte' },
  { id: 'd3', descricao: 'Conta de Luz', valor: 180.00, data: new Date('2026-10-03').toISOString(), categoria: 'Contas' },
  { id: 'd4', descricao: 'Cinema', valor: 35.00, data: new Date('2026-10-04').toISOString(), categoria: 'Lazer' },
];

export const DespesasContext = createContext({
  despesas: [],
  adicionarDespesa: ({ descricao, valor, data, categoria }) => {},
});

export default function DespesasContextProvider({ children }) {
  const [despesasState, setDespesasState] = useState(DESPESAS_INICIAIS);

  function adicionarDespesa(despesaData) {
    const novaDespesa = {
      ...despesaData,
      id: Math.random().toString(),
    };
    setDespesasState((despesasAtuais) => [novaDespesa, ...despesasAtuais]);
  }

  const value = {
    despesas: despesasState,
    adicionarDespesa: adicionarDespesa,
  };

  return (
    <DespesasContext.Provider value={value}>
      {children}
    </DespesasContext.Provider>
  );
}
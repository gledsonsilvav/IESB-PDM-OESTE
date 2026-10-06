import DespesaSaida from '../components/despesa/DespesaSaida';

const DESPESAS_MOCK = [
  { id: 'd1', descricao: 'Almoço', valor: 45.50, data: '2026-10-01', categoria: 'Alimentação' },
  { id: 'd2', descricao: 'Uber', valor: 25.00, data: '2026-10-02', categoria: 'Transporte' },
  { id: 'd3', descricao: 'Conta de Luz', valor: 180.00, data: '2026-10-03', categoria: 'Contas' },
  { id: 'd4', descricao: 'Cinema', valor: 35.00, data: '2026-10-04', categoria: 'Lazer' },
];

export default function TodasDespesas() {
  return <DespesaSaida despesas={DESPESAS_MOCK} periodo="Total Geral" />;
}
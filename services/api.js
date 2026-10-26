const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchNotices() {
  const response = await fetch(`${BASE_URL}/posts?_limit=10`);
  if (!response.ok) {
    throw new Error('Falha ao carregar avisos da API.');
  }
  
  const data = await response.json();

  // Mapeia os dados da API simulada para títulos e textos em português
  const avisosEmPortugues = [
    'Bem-vindo ao semestre letivo do CampusGo!',
    'Inscrições abertas para as Atividades Complementares.',
    'Horário da Biblioteca estendido até as 22h.',
    'Manutenção agendada no sistema acadêmico no fim de semana.',
    'Confira o calendário de provas finais da disciplina.',
    'Feira de Carreiras e Estágios no Bloco Central.',
    'Aviso: Atualização no cardápio do Restaurante Universitário.',
    'Palestra sobre Inteligência Artificial aplicada ao desenvolvimento.',
    'Prazo final para submissão do TCC se aproxima.',
    'Abertas as vagas para o Programa de Monitoria de PDM.'
  ];

  return data.map((item, index) => ({
    ...item,
    title: avisosEmPortugues[index % avisosEmPortugues.length],
    body: `Aviso oficial #${item.id}: Fique atento aos prazos e comunicados importantes do campus.`,
  }));
}
# Atividade 01 — MeuDiarioAcademico

**Disciplina:** Programação para Dispositivos Móveis  
**Professor:** Marcelo Alves Farias — IESB  

---

## 🚀 Comando Utilizado para Criar o Projeto

```bash´´´
npx create-expo-app@latest MeuDiarioAcademico --template blank


📱 Print da Interface
📝 Explicação Técnica do Layout
Flexbox Coerente: Utilização de flexDirection: 'row' na linha do formulário e na linha do Switch para alinhar componentes na horizontal, mantendo a tela principal em coluna (column).

justifyContent e alignItems: Aplicado justifyContent: 'space-between' para distribuir o espaço entre o input e o botão, e alignItems: 'center' para centralizar verticalmente o conteúdo das linhas e o título.

Dimensões Responsivas: Utilizado width: '70%' no TextInput, width: '27%' no Pressable e flex: 1 no container para ocupação proporcional do espaço em tela.

Import/Export: Centralização de rótulos e lista inicial no arquivo labels.js.

Desafios: Implementação do componente Pressable (com estado de pressionado) e do Switch.
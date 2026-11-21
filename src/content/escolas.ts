/** As 12 escolas do currículo (Prompt Master, seção 6). Só as com disciplina publicada são clicáveis. */
export interface Escola {
  letra: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L';
  nome: string;
  resumo: string;
  /** Caminho de um ícone simples (traço SVG 24×24). */
  icone: string;
}

export const ESCOLAS: Escola[] = [
  {
    letra: 'A',
    nome: 'Fundamentos da Computação',
    resumo: 'Hardware, binário, sistemas operacionais e terminal.',
    icone: 'M4 6h16v10H4zM8 20h8M12 16v4',
  },
  {
    letra: 'B',
    nome: 'Lógica de Programação',
    resumo: 'Algoritmos, variáveis, decisões e repetições.',
    icone: 'M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16',
  },
  {
    letra: 'C',
    nome: 'Linguagens de Programação',
    resumo: 'Python, JavaScript, TypeScript, Java, SQL e C.',
    icone: 'M4 4h16v16H4zM8 9h8M8 13h5',
  },
  {
    letra: 'D',
    nome: 'Desenvolvimento Web',
    resumo: 'HTML, CSS, JavaScript, React, APIs e deploy.',
    icone: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  },
  {
    letra: 'E',
    nome: 'UX/UI Design',
    resumo: 'Pesquisa, protótipos, acessibilidade e usabilidade.',
    icone: 'M12 3l2.5 6 6.5.5-5 4 1.5 6.5L12 16.5 6.5 20 8 13.5l-5-4 6.5-.5z',
  },
  {
    letra: 'F',
    nome: 'Engenharia de Software',
    resumo: 'Requisitos, UML, arquitetura, testes e Scrum.',
    icone: 'M4 4h6v6H4zM14 14h6v6h-6zM10 7h4v10',
  },
  {
    letra: 'G',
    nome: 'Programação Orientada a Objetos',
    resumo: 'Classes, objetos, herança e padrões de projeto.',
    icone: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5',
  },
  {
    letra: 'H',
    nome: 'Banco de Dados',
    resumo: 'Modelagem, SQL, transações e otimização.',
    icone:
      'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  },
  {
    letra: 'I',
    nome: 'Arquitetura de Redes',
    resumo: 'OSI, TCP/IP, endereçamento, DNS e roteamento.',
    icone: 'M12 3v6M5 15v-3h14v3M3 15h4v6H3zM10 15h4v6h-4zM17 15h4v6h-4zM9 3h6v6H9z',
  },
  {
    letra: 'J',
    nome: 'Infraestrutura e Servidores',
    resumo: 'Linux, Windows Server, containers e nuvem.',
    icone: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01',
  },
  {
    letra: 'K',
    nome: 'Inteligência Artificial',
    resumo: 'Machine learning, redes neurais e LLMs.',
    icone:
      'M12 4a3 3 0 0 0-3 3 3 3 0 0 0-3 3 3 3 0 0 0 1 5 3 3 0 0 0 5 3V4zM12 4a3 3 0 0 1 3 3 3 3 0 0 1 3 3 3 3 0 0 1-1 5 3 3 0 0 1-5 3',
  },
  {
    letra: 'L',
    nome: 'Cibersegurança',
    resumo: 'Defesa, SOC, AppSec, resposta a incidentes e GRC.',
    icone: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  },
];

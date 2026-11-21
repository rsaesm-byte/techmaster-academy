import type { DisciplinaEntrada } from '@/domain/conteudo';

export const sql: DisciplinaEntrada = {
  id: 'sql',
  escola: 'C',
  titulo: 'SQL',
  descricao:
    'Converse com bancos de dados: leia, filtre, ordene, resuma e ligue tabelas, treinando num banco de brinquedo dentro do próprio app.',
  modulos: [
    {
      id: 'sql.m01',
      titulo: 'Consultando dados',
      descricao: 'SELECT, WHERE, ORDER BY e LIMIT, funções de agregação com GROUP BY e JOIN.',
      aulas: ['sql.m01.a01', 'sql.m01.a02', 'sql.m01.a03', 'sql.m01.a04', 'sql.m01.a05'],
    },
  ],
};

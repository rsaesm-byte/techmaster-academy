import type { DisciplinaEntrada } from '@/domain/conteudo';

export const bancos: DisciplinaEntrada = {
  id: 'bancos',
  escola: 'H',
  titulo: 'Modelagem e Projeto de Bancos de Dados',
  descricao:
    'Projete bancos confiáveis: modelagem, normalização, chaves e integridade, índices e transações ACID.',
  modulos: [
    {
      id: 'bancos.m01',
      titulo: 'Projetando bancos confiáveis',
      descricao:
        'Entidades e relacionamentos, formas normais, chaves e restrições, índices e desempenho, transações e ACID.',
      aulas: [
        'bancos.m01.a01',
        'bancos.m01.a02',
        'bancos.m01.a03',
        'bancos.m01.a04',
        'bancos.m01.a05',
      ],
    },
  ],
};

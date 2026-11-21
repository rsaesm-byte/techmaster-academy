import type { DisciplinaEntrada } from '@/domain/conteudo';

export const javascript: DisciplinaEntrada = {
  id: 'javascript',
  escola: 'C',
  titulo: 'JavaScript',
  descricao:
    'A linguagem da web, rodando direto no seu navegador: variáveis, decisões, laços, funções, objetos e transformação de listas, com exercícios corrigidos automaticamente.',
  modulos: [
    {
      id: 'javascript.m01',
      titulo: 'Primeiros passos em JavaScript',
      descricao:
        'Variáveis e tipos, condicionais, arrays e laços, funções e arrow functions, objetos com map, filter e reduce.',
      aulas: [
        'javascript.m01.a01',
        'javascript.m01.a02',
        'javascript.m01.a03',
        'javascript.m01.a04',
        'javascript.m01.a05',
      ],
    },
    {
      id: 'javascript.m02',
      titulo: 'JavaScript na web',
      descricao:
        'JSON, desestruturação e spread, DOM e eventos, tratamento de erros e código assíncrono.',
      aulas: [
        'javascript.m02.a01',
        'javascript.m02.a02',
        'javascript.m02.a03',
        'javascript.m02.a04',
        'javascript.m02.a05',
      ],
    },
  ],
};

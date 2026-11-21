import type { DisciplinaEntrada } from '@/domain/conteudo';

export const python: DisciplinaEntrada = {
  id: 'python',
  escola: 'C',
  titulo: 'Python',
  descricao:
    'A linguagem de dados, automação e IA: sintaxe limpa, listas, funções e dicionários, comparada passo a passo com JavaScript.',
  modulos: [
    {
      id: 'python.m01',
      titulo: 'Primeiros passos em Python',
      descricao:
        'Variáveis e f-strings, condicionais com indentação, listas e laços, funções e dicionários com compreensões.',
      aulas: [
        'python.m01.a01',
        'python.m01.a02',
        'python.m01.a03',
        'python.m01.a04',
        'python.m01.a05',
      ],
    },
    {
      id: 'python.m02',
      titulo: 'Python no dia a dia',
      descricao: 'Textos, tuplas e conjuntos, arquivos, tratamento de erros e módulos com pip.',
      aulas: [
        'python.m02.a01',
        'python.m02.a02',
        'python.m02.a03',
        'python.m02.a04',
        'python.m02.a05',
      ],
    },
  ],
};

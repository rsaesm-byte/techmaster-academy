import type { DisciplinaEntrada } from '@/domain/conteudo';

export const poo: DisciplinaEntrada = {
  id: 'poo',
  escola: 'G',
  titulo: 'Programação Orientada a Objetos',
  descricao:
    'Pense em objetos: classes e instâncias, encapsulamento, herança, polimorfismo e composição, com JavaScript.',
  modulos: [
    {
      id: 'poo.m01',
      titulo: 'Pensando em objetos',
      descricao:
        'Classes e objetos, encapsulamento, herança, polimorfismo e interfaces, composição e bom projeto.',
      aulas: ['poo.m01.a01', 'poo.m01.a02', 'poo.m01.a03', 'poo.m01.a04', 'poo.m01.a05'],
    },
  ],
};

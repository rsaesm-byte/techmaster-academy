import type { DisciplinaEntrada } from '@/domain/conteudo';

export const logica: DisciplinaEntrada = {
  id: 'logica',
  escola: 'B',
  titulo: 'Lógica de Programação',
  descricao:
    'Aprenda a pensar como um programador: transformar problemas em passos claros que um computador consegue seguir.',
  modulos: [
    {
      id: 'logica.m01',
      titulo: 'Do problema ao algoritmo',
      descricao:
        'O que é um algoritmo, como guardar dados em variáveis, fazer contas, tomar decisões e repetir tarefas.',
      aulas: [
        'logica.m01.a01',
        'logica.m01.a02',
        'logica.m01.a03',
        'logica.m01.a04',
        'logica.m01.a05',
      ],
    },
  ],
};

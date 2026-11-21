import type { DisciplinaEntrada } from '@/domain/conteudo';

export const fundamentos: DisciplinaEntrada = {
  id: 'fundamentos',
  escola: 'A',
  titulo: 'Fundamentos da Computação',
  descricao:
    'Entenda o que acontece por baixo de tudo: bits, texto, circuitos, processador, memória e a linha de comando.',
  modulos: [
    {
      id: 'fundamentos.m01',
      titulo: 'Como o computador pensa',
      descricao:
        'Do bit ao processador: binário, texto e hexadecimal, portas lógicas, a CPU executando instruções e o terminal.',
      aulas: [
        'fundamentos.m01.a01',
        'fundamentos.m01.a02',
        'fundamentos.m01.a03',
        'fundamentos.m01.a04',
        'fundamentos.m01.a05',
      ],
    },
  ],
};

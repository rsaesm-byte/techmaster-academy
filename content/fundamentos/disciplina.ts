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
    {
      id: 'fundamentos.m02',
      titulo: 'Sistemas, redes e segurança',
      descricao:
        'Como o sistema operacional reparte a CPU, quem pode acessar cada arquivo, como as redes se endereçam, como a web funciona e como proteger contas.',
      aulas: [
        'fundamentos.m02.a01',
        'fundamentos.m02.a02',
        'fundamentos.m02.a03',
        'fundamentos.m02.a04',
        'fundamentos.m02.a05',
      ],
    },
    {
      id: 'fundamentos.m03',
      titulo: 'Dados: guardar, acelerar, comprimir e proteger',
      descricao:
        'Unidades de dados, hierarquia de memória e cache, armazenamento e RAID, compressão e criptografia.',
      aulas: [
        'fundamentos.m03.a01',
        'fundamentos.m03.a02',
        'fundamentos.m03.a03',
        'fundamentos.m03.a04',
        'fundamentos.m03.a05',
      ],
    },
  ],
};

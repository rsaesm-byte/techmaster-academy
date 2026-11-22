import type { DisciplinaEntrada } from '@/domain/conteudo';

export const infra: DisciplinaEntrada = {
  id: 'infra',
  escola: 'J',
  titulo: 'Infraestrutura e Servidores',
  descricao:
    'Opere sistemas reais: servidores e disponibilidade, Linux e logs, contêineres, nuvem e escalabilidade, monitoramento e recuperação.',
  modulos: [
    {
      id: 'infra.m01',
      titulo: 'Servidores no mundo real',
      descricao:
        'Disponibilidade, serviços e logs no Linux, Docker, nuvem com balanceamento e monitoramento com plano de recuperação.',
      aulas: ['infra.m01.a01', 'infra.m01.a02', 'infra.m01.a03', 'infra.m01.a04', 'infra.m01.a05'],
    },
  ],
};

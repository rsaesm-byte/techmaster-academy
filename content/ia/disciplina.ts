import type { DisciplinaEntrada } from '@/domain/conteudo';

export const ia: DisciplinaEntrada = {
  id: 'ia',
  escola: 'K',
  titulo: 'Inteligência Artificial',
  descricao:
    'Entenda e construa a base da IA: aprendizado de máquina, k-NN, avaliação de modelos, redes neurais e IA generativa com uso responsável.',
  modulos: [
    {
      id: 'ia.m01',
      titulo: 'IA na prática',
      descricao:
        'De regras a dados, classificação por vizinhança, métricas de avaliação, o neurônio artificial e os modelos de linguagem.',
      aulas: ['ia.m01.a01', 'ia.m01.a02', 'ia.m01.a03', 'ia.m01.a04', 'ia.m01.a05'],
    },
  ],
};

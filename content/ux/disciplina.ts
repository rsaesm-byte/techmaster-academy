import type { DisciplinaEntrada } from '@/domain/conteudo';

export const ux: DisciplinaEntrada = {
  id: 'ux',
  escola: 'E',
  titulo: 'UX/UI Design',
  descricao:
    'Projete para pessoas: pesquisa com usuários, usabilidade, cor e acessibilidade, layout com design systems e teste com protótipos.',
  modulos: [
    {
      id: 'ux.m01',
      titulo: 'Design centrado no usuário',
      descricao:
        'UX e pesquisa, heurísticas de usabilidade, contraste e acessibilidade, hierarquia visual e design systems, e prototipação com testes.',
      aulas: ['ux.m01.a01', 'ux.m01.a02', 'ux.m01.a03', 'ux.m01.a04', 'ux.m01.a05'],
    },
  ],
};

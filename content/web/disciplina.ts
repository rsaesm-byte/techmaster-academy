import type { DisciplinaEntrada } from '@/domain/conteudo';

export const web: DisciplinaEntrada = {
  id: 'web',
  escola: 'D',
  titulo: 'HTML, CSS e a Web',
  descricao:
    'Construa e publique páginas: HTML semântico, CSS, layout responsivo com Flexbox, formulários acessíveis e um portfólio no ar.',
  modulos: [
    {
      id: 'web.m01',
      titulo: 'Sua primeira página na web',
      descricao:
        'HTML, CSS, Flexbox e design responsivo, formulários e acessibilidade, e a publicação de um portfólio.',
      aulas: ['web.m01.a01', 'web.m01.a02', 'web.m01.a03', 'web.m01.a04', 'web.m01.a05'],
    },
  ],
};

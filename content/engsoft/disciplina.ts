import type { DisciplinaEntrada } from '@/domain/conteudo';

export const engsoft: DisciplinaEntrada = {
  id: 'engsoft',
  escola: 'F',
  titulo: 'Engenharia de Software',
  descricao:
    'Do requisito à entrega: métodos ágeis, Git, testes automatizados, histórias de usuário e CI/CD.',
  modulos: [
    {
      id: 'engsoft.m01',
      titulo: 'Do requisito à entrega',
      descricao:
        'Ciclo de vida e métodos ágeis, versionamento com Git, testes, requisitos e qualidade com CI/CD.',
      aulas: [
        'engsoft.m01.a01',
        'engsoft.m01.a02',
        'engsoft.m01.a03',
        'engsoft.m01.a04',
        'engsoft.m01.a05',
      ],
    },
  ],
};

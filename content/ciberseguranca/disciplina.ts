import type { DisciplinaEntrada } from '@/domain/conteudo';

export const ciberseguranca: DisciplinaEntrada = {
  id: 'ciberseguranca',
  escola: 'L',
  titulo: 'Fundamentos de Cibersegurança',
  descricao:
    'Do raciocínio de risco aos hábitos do dia a dia: tríade CIA, senhas e MFA, phishing, injeção de SQL, backups e resposta a incidentes.',
  modulos: [
    {
      id: 'ciberseguranca.m01',
      titulo: 'Defesa em profundidade',
      descricao:
        'A tríade CIA, senhas com hash e MFA, engenharia social, injeção de SQL e higiene de segurança.',
      aulas: [
        'ciberseguranca.m01.a01',
        'ciberseguranca.m01.a02',
        'ciberseguranca.m01.a03',
        'ciberseguranca.m01.a04',
        'ciberseguranca.m01.a05',
      ],
    },
  ],
};

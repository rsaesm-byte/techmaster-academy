import { describe, expect, it } from 'vitest';
import { aulas, disciplinas } from '@content/index';
import { aula01 } from '@content/logica/m01/a01-o-que-e-algoritmo';
import { ConteudoInvalidoError, montarCatalogo } from '@/content/catalogo';

/** Clona e altera a aula 1 para simular erros de autoria. */
function aulaCom(alterar: (a: typeof aula01) => void) {
  const copia = structuredClone(aula01);
  alterar(copia);
  return copia;
}

function problemasDe(fn: () => unknown): string[] {
  try {
    fn();
  } catch (e) {
    if (e instanceof ConteudoInvalidoError) return e.problemas;
    throw e;
  }
  return [];
}

describe('conteúdo válido', () => {
  it('todo o conteúdo do repositório passa na validação', () => {
    expect(problemasDe(() => montarCatalogo(disciplinas, aulas))).toEqual([]);
  });
});

describe('a validação barra erros de autoria', () => {
  it('aula publicada sem exercício desafio', () => {
    const ruim = aulaCom((a) => {
      a.etapas = a.etapas.filter((e) => !(e.tipo === 'exercicio' && e.modo === 'desafio'));
      a.criterioDominio.questoes = ['rec.q1'];
    });
    expect(problemasDe(() => montarCatalogo(disciplinas, [ruim]))).toContainEqual(
      expect.stringContaining('aula publicada sem desafio aplicado'),
    );
  });

  it('rascunho pode estar incompleto', () => {
    const rascunho = aulaCom((a) => {
      a.status = 'rascunho';
      a.etapas = a.etapas.filter((e) => e.tipo !== 'flashcards');
    });
    expect(problemasDe(() => montarCatalogo(disciplinas, [rascunho]))).toEqual([]);
  });

  it('alternativa errada sem feedback', () => {
    const ruim = aulaCom((a) => {
      const diag = a.etapas[0];
      if (diag?.tipo === 'diagnostico' && diag.questoes[0]?.tipo === 'multipla-escolha') {
        delete diag.questoes[0].alternativas[1]!.feedback;
      }
    });
    expect(problemasDe(() => montarCatalogo(disciplinas, [ruim]))).toContainEqual(
      expect.stringContaining('alternativa errada precisa de feedback'),
    );
  });

  it('critério de domínio apontando para questão inexistente', () => {
    const ruim = aulaCom((a) => {
      a.criterioDominio.questoes.push('nao-existe');
    });
    expect(problemasDe(() => montarCatalogo(disciplinas, [ruim]))).toContainEqual(
      expect.stringContaining('"nao-existe" não é uma questão'),
    );
  });

  it('módulo apontando para aula que não existe', () => {
    expect(problemasDe(() => montarCatalogo(disciplinas, []))).toContainEqual(
      expect.stringContaining('aula "logica.m01.a01" não existe'),
    );
  });

  it('ids de etapa repetidos', () => {
    const ruim = aulaCom((a) => {
      a.etapas[1]!.id = 'diag';
    });
    expect(problemasDe(() => montarCatalogo(disciplinas, [ruim]))).toContainEqual(
      expect.stringContaining('id repetido: "diag"'),
    );
  });
});

/**
 * Auditoria automática de acessibilidade (axe-core, regras WCAG 2.x A/AA) em todas as telas.
 * O contraste de cores não é medido aqui (o jsdom não calcula estilos): ele foi conferido
 * na Fase 0 e é checado no navegador real.
 */
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { App } from '@/app/App';
import { MemoriaProgressRepository } from '@/persistence/memoria';

beforeAll(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  // jsdom não tem canvas; a simulação WebGL cai no fallback e axe só precisa do HTML.
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
});

const TELAS: [string, string, RegExp][] = [
  ['Painel', '#/', /Pronto para o próximo passo/],
  ['Boas-vindas', '#/boas-vindas', /Bem-vindo/],
  ['Escolas', '#/escolas', /^Escolas$/],
  ['Trilha', '#/trilha/logica', /Lógica de Programação/],
  ['Aula', '#/aula/logica.m01.a02', /Antes de começar/],
  ['Revisão', '#/revisao', /Revisão do dia/],
  ['Laboratórios', '#/labs', /Laboratórios/],
  ['Visualizador', '#/lab/algoritmos', /Visualizador de Algoritmos/],
  ['Robô', '#/lab/robo', /Robô do tabuleiro/],
  ['Configurações', '#/configuracoes', /Configurações/],
  ['Meu progresso', '#/progresso', /Meu progresso/],
  ['Glossário', '#/glossario', /Glossário/],
  ['Editor Web', '#/lab/web', /Editor Web/],
  ['Ordenação', '#/lab/ordenacao', /Busca e ordenação/],
  ['Binário', '#/lab/binario', /Binário: a língua do computador/],
  ['Sistemas', '#/lab/sistemas', /Sistemas, redes e segurança/],
  ['Dados', '#/lab/dados', /Dados: guardar, acelerar/],
  ['CPU', '#/lab/cpu', /CPU: o ciclo buscar/],
  ['Terminal', '#/lab/terminal', /Terminal: converse com o computador/],
  ['Portas lógicas', '#/lab/portas', /Portas lógicas: de onde vem o processador/],
];

describe('acessibilidade (axe)', () => {
  it.each(TELAS)('%s sem violações', async (_nome, hash, titulo) => {
    window.location.hash = hash;
    const { container } = render(<App repositorio={new MemoriaProgressRepository()} />);
    await screen.findByRole('heading', { level: 1, name: titulo });
    const r = await axe.run(container, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
      rules: { 'color-contrast': { enabled: false } },
      iframes: false, // a prévia do Editor Web é conteúdo do aluno, isolado
    });
    expect(
      r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
    ).toEqual([]);
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { TerminalSim } from './TerminalSim';

async function digitar(u: ReturnType<typeof userEvent.setup>, linha: string) {
  await u.type(screen.getByLabelText(/aluno@techmaster/), linha + '{Enter}');
}

describe('terminal simulado', () => {
  it('executa comandos e mostra a saída', async () => {
    const u = userEvent.setup();
    render(<TerminalSim />);
    await digitar(u, 'ls');
    expect(screen.getByRole('log')).toHaveTextContent('documentos/');
    await digitar(u, 'cat ola.txt');
    expect(screen.getByRole('log')).toHaveTextContent('Olá, mundo!');
  });

  it('o prompt acompanha o cd', async () => {
    const u = userEvent.setup();
    render(<TerminalSim />);
    await digitar(u, 'cd documentos');
    expect(document.querySelector('label[for=terminal-entrada]')).toHaveTextContent('~/documentos');
  });

  it('comando desconhecido mostra mensagem de erro', async () => {
    const u = userEvent.setup();
    render(<TerminalSim />);
    await digitar(u, 'xyz');
    expect(screen.getByRole('log')).toHaveTextContent('comando não encontrado');
  });

  it('missões de navegação são cumpridas em ordem', async () => {
    const u = userEvent.setup();
    render(<TerminalSim cenario="navegar" />);
    await digitar(u, 'cd projetos/site');
    expect(screen.getByText('Entre na pasta projetos/site').nextElementSibling).toHaveTextContent(
      '(feita)',
    );
    await digitar(u, 'cd ~');
    expect(screen.getByRole('status')).toHaveTextContent('Missões cumpridas');
  });

  it('missões de arquivos', async () => {
    const u = userEvent.setup();
    render(<TerminalSim cenario="arquivos" />);
    await digitar(u, 'mkdir estudos');
    await digitar(u, 'echo "regras de redes" > estudos/anotacoes.txt');
    await digitar(u, 'cp ola.txt estudos');
    expect(screen.getByRole('status')).toHaveTextContent('Missões cumpridas');
  });

  it('reiniciar restaura as pastas', async () => {
    const u = userEvent.setup();
    render(<TerminalSim />);
    await digitar(u, 'rm ola.txt');
    await u.click(screen.getByRole('button', { name: 'Reiniciar' }));
    await digitar(u, 'ls');
    expect(screen.getByRole('log')).toHaveTextContent('ola.txt');
  });

  it('sem violações de acessibilidade', async () => {
    const { container } = render(<TerminalSim cenario="arquivos" />);
    const r = await axe.run(container, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html.slice(0, 80))}`)).toEqual(
      [],
    );
  });
});

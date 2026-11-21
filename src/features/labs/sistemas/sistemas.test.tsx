import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { EscalonadorSim } from './EscalonadorSim';
import { PermissoesSim } from './PermissoesSim';
import { RedeSim } from './RedeSim';
import { SenhaSim } from './SenhaSim';
import { WebSim } from './WebSim';

const axeOpts = {
  runOnly: { type: 'tag' as const, values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
  rules: { 'color-contrast': { enabled: false } },
};

describe('permissões', () => {
  it('liga bits e mostra octal e simbólico', async () => {
    const u = userEvent.setup();
    render(<PermissoesSim octal="644" />);
    expect(screen.getByRole('status')).toHaveTextContent('chmod 644');
    expect(screen.getByRole('status')).toHaveTextContent('rw-r--r--');
    await u.click(screen.getByRole('button', { name: 'Dono: execução' }));
    await u.click(screen.getByRole('button', { name: 'Grupo: execução' }));
    expect(screen.getByRole('status')).toHaveTextContent('chmod 754');
  });
});

describe('rede', () => {
  it('calcula a rede e o broadcast', () => {
    render(<RedeSim />);
    expect(screen.getByText('192.168.1.0')).toBeVisible();
    expect(screen.getByText('192.168.1.255')).toBeVisible();
    expect(screen.getByText('254')).toBeVisible();
  });
  it('avisa quando o IP é inválido', async () => {
    const u = userEvent.setup();
    render(<RedeSim />);
    await u.clear(screen.getByLabelText('Endereço IP'));
    await u.type(screen.getByLabelText('Endereço IP'), '999.1.1.1');
    expect(screen.getByRole('alert')).toBeVisible();
  });
});

describe('escalonador', () => {
  it('troca de algoritmo e muda a espera média', async () => {
    const u = userEvent.setup();
    render(<EscalonadorSim algoritmo="fifo" />);
    expect(screen.getByRole('status')).toHaveTextContent('Espera média: 4.0');
    await u.click(screen.getByRole('button', { name: /Round Robin/ }));
    expect(screen.getByRole('status')).toHaveTextContent(/Espera média: 4\.3/);
  });
});

describe('senha', () => {
  it('senha curta só de minúsculas é fraca; ligar tudo e aumentar torna forte', async () => {
    const u = userEvent.setup();
    render(<SenhaSim />);
    expect(screen.getByRole('status')).toHaveTextContent('fraca');
    for (const t of [/maiúsculas/, /Números/, /Símbolos/]) await u.click(screen.getByLabelText(t));
    fireEvent.change(screen.getByLabelText(/Comprimento/), { target: { value: '24' } });
    expect(screen.getByRole('status')).toHaveTextContent('muito forte');
  });
});

describe('web', () => {
  it('percorre os 6 passos', async () => {
    const u = userEvent.setup();
    render(<WebSim />);
    expect(screen.getByText('1. Pergunta ao DNS')).toBeVisible();
    for (let i = 0; i < 5; i++)
      await u.click(screen.getByRole('button', { name: 'Próximo passo' }));
    expect(screen.getByText('6. Navegador desenha a página')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Próximo passo' })).toBeDisabled();
  });
});

describe('acessibilidade dos simuladores de sistemas', () => {
  it.each([
    ['permissões', <PermissoesSim key="a" />],
    ['rede', <RedeSim key="b" />],
    ['escalonador', <EscalonadorSim key="c" />],
    ['senha', <SenhaSim key="d" />],
    ['web', <WebSim key="e" />],
  ])('%s sem violações', async (_n, el) => {
    const { container } = render(el);
    const r = await axe.run(container, axeOpts);
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html.slice(0, 80))}`)).toEqual(
      [],
    );
  });
});

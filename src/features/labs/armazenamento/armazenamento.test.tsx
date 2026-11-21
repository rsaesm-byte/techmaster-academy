import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { CacheSim } from './CacheSim';
import { CesarSim } from './CesarSim';
import { CompressaoSim } from './CompressaoSim';
import { RaidSim } from './RaidSim';
import { UnidadesSim } from './UnidadesSim';

describe('unidades', () => {
  it('500 GB anunciados aparecem como 466 GB', () => {
    render(<UnidadesSim />);
    expect(screen.getByRole('status')).toHaveTextContent('500 GB');
    expect(screen.getByRole('status')).toHaveTextContent('466 GB');
  });
});

describe('cache', () => {
  it('LRU tem mais acertos que FIFO na sequência padrão', async () => {
    const u = userEvent.setup();
    render(<CacheSim />);
    expect(screen.getByRole('status')).toHaveTextContent('2 acertos em 7');
    await u.click(screen.getByRole('button', { name: /FIFO/ }));
    expect(screen.getByRole('status')).toHaveTextContent('1 acertos em 7');
  });
});

describe('raid', () => {
  it('RAID 1 tolera 1 falha e RAID 0 não', async () => {
    const u = userEvent.setup();
    render(<RaidSim />);
    await u.click(screen.getByRole('button', { name: 'Disco 1: funcionando' }));
    expect(screen.getByRole('status')).toHaveTextContent('Os dados continuam acessíveis');
    await u.click(screen.getByRole('button', { name: 'RAID 0' }));
    await u.click(screen.getByRole('button', { name: 'Disco 1: funcionando' }));
    expect(screen.getByRole('status')).toHaveTextContent('Dados perdidos');
  });
});

describe('compressão', () => {
  it('comprime e volta idêntico; recusa números', () => {
    render(<CompressaoSim inicial="AAAABB" />);
    expect(screen.getByText('4A2B')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Voltou idêntico');
  });
  it('avisa sobre dígitos', async () => {
    const u = userEvent.setup();
    render(<CompressaoSim inicial="AB" />);
    await u.type(screen.getByLabelText(/Texto/), '1');
    expect(screen.getByRole('alert')).toBeVisible();
  });
});

describe('césar', () => {
  it('cifra e mostra as 25 chaves', async () => {
    const u = userEvent.setup();
    render(<CesarSim inicial="abc" />);
    expect(screen.getByRole('status')).toHaveTextContent('def');
    await u.click(screen.getByRole('button', { name: /Quebrar a cifra/ }));
    expect(screen.getAllByText(/^chave \d+:/)).toHaveLength(25);
    fireEvent.change(screen.getByLabelText(/Deslocamento/), { target: { value: '5' } });
    expect(screen.getByRole('status')).toHaveTextContent('fgh');
  });
});

describe('acessibilidade dos simuladores de dados', () => {
  it.each([
    ['unidades', <UnidadesSim key="a" />],
    ['cache', <CacheSim key="b" />],
    ['raid', <RaidSim key="c" />],
    ['compressão', <CompressaoSim key="d" />],
    ['césar', <CesarSim key="e" />],
  ])('%s sem violações', async (_n, el) => {
    const { container } = render(el);
    const r = await axe.run(container, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] },
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html.slice(0, 80))}`)).toEqual(
      [],
    );
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { Questao } from '@/domain/conteudo';
import { QuestaoCard } from '@/features/exercicios/QuestaoCard';

const me: Questao = {
  id: 'q-me',
  tipo: 'multipla-escolha',
  enunciado: 'Qual característica garante que o algoritmo termina?',
  pistas: ['Pense no fim.'],
  explicacao: 'Finitude: termina em passos limitados.',
  alternativas: [
    { id: 'a', texto: 'Finitude' },
    { id: 'b', texto: 'Saída', feedback: 'Saída é produzir resultado.' },
  ],
  correta: 'a',
};

describe('QuestaoCard', () => {
  it('erro mostra feedback específico, registra a tentativa e permite tentar de novo', async () => {
    const u = userEvent.setup();
    const registrar = vi.fn();
    render(<QuestaoCard questao={me} aoRegistrar={registrar} />);

    expect(screen.getByRole('button', { name: 'Verificar' })).toBeDisabled();
    await u.click(screen.getByRole('radio', { name: /Saída/ }));
    await u.click(screen.getByRole('button', { name: 'Verificar' }));

    expect(screen.getByText('Ainda não')).toBeVisible();
    expect(screen.getByText('Saída é produzir resultado.')).toBeVisible();
    expect(registrar).toHaveBeenCalledWith(
      expect.objectContaining({ questaoId: 'q-me', correta: false, respostaRevelada: false }),
    );

    await u.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    await u.click(screen.getByRole('radio', { name: /Finitude/ }));
    await u.click(screen.getByRole('button', { name: 'Verificar' }));
    expect(screen.getByText('Correto!')).toBeVisible();
    expect(screen.getByText('Finitude: termina em passos limitados.')).toBeVisible();
    expect(screen.getByRole('radio', { name: /Finitude/ })).toBeDisabled();
  });

  it('pistas aparecem uma de cada vez e contam na tentativa', async () => {
    const u = userEvent.setup();
    const registrar = vi.fn();
    render(<QuestaoCard questao={me} aoRegistrar={registrar} />);
    await u.click(screen.getByRole('button', { name: 'Pedir pista (1 de 1)' }));
    expect(screen.getByText('Pense no fim.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Sem mais pistas' })).toBeDisabled();
    await u.click(screen.getByRole('radio', { name: /Finitude/ }));
    await u.click(screen.getByRole('button', { name: 'Verificar' }));
    expect(registrar).toHaveBeenCalledWith(expect.objectContaining({ pistasUsadas: 1 }));
  });

  it('"Ver resposta" só aparece depois de 2 erros e marca como revelada', async () => {
    const u = userEvent.setup();
    const registrar = vi.fn();
    render(<QuestaoCard questao={me} aoRegistrar={registrar} />);
    await u.click(screen.getByRole('radio', { name: /Saída/ }));
    await u.click(screen.getByRole('button', { name: 'Verificar' }));
    expect(screen.queryByRole('button', { name: 'Ver resposta' })).not.toBeInTheDocument();
    await u.click(screen.getByRole('button', { name: 'Tentar de novo' }));
    await u.click(screen.getByRole('button', { name: 'Verificar' }));
    await u.click(screen.getByRole('button', { name: 'Ver resposta' }));
    expect(registrar).toHaveBeenLastCalledWith(expect.objectContaining({ respostaRevelada: true }));
    expect(screen.getByText(/volta na revisão/)).toBeVisible();
  });

  it('ordenação funciona só com teclado (botões subir/descer)', async () => {
    const u = userEvent.setup();
    const registrar = vi.fn();
    const ordem: Questao = {
      id: 'q-ord',
      tipo: 'ordenacao',
      enunciado: 'Ordene',
      pistas: [],
      explicacao: 'Assim.',
      itens: [
        { id: '1', texto: 'Primeiro' },
        { id: '2', texto: 'Segundo' },
        { id: '3', texto: 'Terceiro' },
      ],
    };
    render(<QuestaoCard questao={ordem} aoRegistrar={registrar} />);
    // Ordena: leva cada item para o topo, do último para o primeiro.
    for (const texto of ['Terceiro', 'Segundo', 'Primeiro']) {
      for (let i = 0; i < 3; i++) {
        const subir = screen.getByRole('button', { name: `Mover "${texto}" para cima` });
        if (!subir.hasAttribute('disabled')) await u.click(subir);
      }
    }
    await u.click(screen.getByRole('button', { name: 'Verificar' }));
    expect(screen.getByText('Correto!')).toBeVisible();
  });

  it('prever a saída: Enter verifica', async () => {
    const u = userEvent.setup();
    const saida: Questao = {
      id: 'q-s',
      tipo: 'prever-saida',
      enunciado: 'Saída?',
      pistas: [],
      explicacao: '5 + 3 = 8.',
      codigo: { linguagem: 'pseudocodigo', fonte: 'escreva(5 + 3)' },
      respostasAceitas: ['8'],
      errosComuns: [],
    };
    render(<QuestaoCard questao={saida} aoRegistrar={vi.fn()} />);
    await u.type(screen.getByLabelText('O que aparece na tela?'), '8{Enter}');
    expect(screen.getByText('Correto!')).toBeVisible();
  });
});

describe('resposta aberta', () => {
  it('compara com o modelo, autoavalia pela rubrica e registra', async () => {
    const u = userEvent.setup();
    const registrar = vi.fn();
    const q: Questao = {
      id: 'q-aberta',
      tipo: 'resposta-aberta',
      enunciado: 'Explique o que é uma variável.',
      pistas: [],
      explicacao: 'x',
      respostaModelo: 'Um nome para um espaço da memória.',
      rubrica: ['Citou memória', 'Citou nome', 'Deu exemplo'],
    };
    render(<QuestaoCard questao={q} aoRegistrar={registrar} />);
    const comparar = screen.getByRole('button', { name: 'Comparar com a resposta-modelo' });
    expect(comparar).toBeDisabled();
    await u.type(
      screen.getByLabelText(/Escreva com suas palavras/),
      'É uma gaveta com nome na memória do computador.',
    );
    await u.click(comparar);
    expect(screen.getByText('Um nome para um espaço da memória.')).toBeVisible();
    await u.click(screen.getByRole('checkbox', { name: 'Citou memória' }));
    await u.click(screen.getByRole('checkbox', { name: 'Citou nome' }));
    await u.click(screen.getByRole('button', { name: 'Concluir autoavaliação' }));
    expect(screen.getByText(/2 de 3 critérios/)).toBeVisible();
    expect(registrar).toHaveBeenCalledWith(
      expect.objectContaining({ questaoId: 'q-aberta', correta: true }),
    );
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { BotaoAtualizar } from '@/app/BotaoAtualizar';

describe('BotaoAtualizar', () => {
  it('avisa que já está na versão mais recente quando não há atualização', async () => {
    render(<BotaoAtualizar />);
    await userEvent.click(screen.getByRole('button', { name: 'Atualizar app' }));
    expect(await screen.findByText('Você já está na versão mais recente.')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import type { ServicoContratadoPrestador } from '../../../../models/servico-contratado-prestador.model';
import ServicoContratadoPrestadorCard from '../ServicoContratadoPrestadorCard';

const mockServico: ServicoContratadoPrestador = {
  id: 7,
  titulo: 'Pintura residencial',
  categoria: 'PINTURA',
  nomeContratante: 'Ana Souza',
  localAtendimento: 'Boa Viagem, Recife',
  dataOuPeriodoSolicitado: 'Semana de 2026-09-14',
  statusAtual: 'CONTRATADO',
};

describe('ServicoContratadoPrestadorCard', () => {
  test('deve exibir os dados relevantes do atendimento', () => {
    render(
      <ServicoContratadoPrestadorCard
        servico={mockServico}
        onAtualizarStatus={vi.fn()}
      />
    );

    expect(screen.getByText('Pintura residencial')).toBeInTheDocument();
    expect(screen.getByText('PINTURA')).toBeInTheDocument();
    expect(screen.getByText('Não iniciado')).toBeInTheDocument();
    expect(screen.getByText('Ana Souza')).toBeInTheDocument();
    expect(screen.getByText('Boa Viagem, Recife')).toBeInTheDocument();
    expect(screen.getByText('Semana de 2026-09-14')).toBeInTheDocument();
  });

  test('deve disparar a ação de atualizar status com o id do serviço', async () => {
    const user = userEvent.setup();
    const onAtualizarStatus = vi.fn();

    render(
      <ServicoContratadoPrestadorCard
        servico={mockServico}
        onAtualizarStatus={onAtualizarStatus}
      />
    );

    await user.click(screen.getByRole('button', { name: /atualizar status/i }));

    expect(onAtualizarStatus).toHaveBeenCalledWith(7);
  });
});

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { orcamentoService } from '../../../services/orcamento.service';
import type { OrcamentoResponse } from '../../../models/orcamento-response.model';

const respostaSchema = z
  .object({
    valor: z
      .number({ invalid_type_error: 'Informe um valor numérico válido.' })
      .min(0.01, 'O valor deve ser maior que zero.')
      .optional(),
    condicoes: z.string().trim().optional(),
  })
  .refine(
    (data) =>
      (data.valor !== undefined && !Number.isNaN(data.valor)) ||
      Boolean(data.condicoes && data.condicoes.length > 0),
    {
      message: 'Informe o valor e/ou as condições do serviço para enviar a resposta.',
      path: ['condicoes'],
    },
  );

type RespostaFormData = z.infer<typeof respostaSchema>;

interface ModalResponderOrcamentoProps {
  readonly orcamento: OrcamentoResponse;
  readonly onClose: () => void;
  readonly onSucesso: (orcamentoId: number, valor?: number, condicoes?: string) => void;
}

export default function ModalResponderOrcamento({
  orcamento,
  onClose,
  onSucesso,
}: ModalResponderOrcamentoProps) {
  const [enviando, setEnviando] = useState(false);
  const [erroFeedback, setErroFeedback] = useState('');
  const [sucessoFeedback, setSucessoFeedback] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RespostaFormData>({
    resolver: zodResolver(respostaSchema),
    defaultValues: {
      valor: orcamento.valorResposta != null ? Number(orcamento.valorResposta) : undefined,
      condicoes: orcamento.descricaoResposta || '',
    },
  });

  useEffect(() => {
    reset({
      valor: orcamento.valorResposta != null ? Number(orcamento.valorResposta) : undefined,
      condicoes: orcamento.descricaoResposta || '',
    });
  }, [orcamento, reset]);

  const onSubmit = async (data: RespostaFormData) => {
    try {
      setEnviando(true);
      setErroFeedback('');

      await orcamentoService.responderOrcamento(orcamento.id, {
        valorResposta: data.valor !== undefined ? Number(data.valor) : 0,
        descricaoResposta: data.condicoes || '',
      });

      setSucessoFeedback('Orçamento respondido com sucesso!');
      onSucesso(orcamento.id, data.valor, data.condicoes);

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Erro ao responder orçamento:', err);
      setErroFeedback('Não foi possível enviar a resposta. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <dialog open className="modal-overlay">
      <div className="modal-content">
        <h2>Responder Orçamento</h2>
        <p className="modal-subtitle">
          Solicitante: <strong>{orcamento.nomeSolicitante}</strong> | Serviço:{' '}
          <strong>{orcamento.tituloServico}</strong>
        </p>

        {erroFeedback && <div className="alert alert-danger">{erroFeedback}</div>}
        {sucessoFeedback && <div className="alert alert-success">{sucessoFeedback}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-field">
            <label htmlFor="valor">Valor proposto (R$)</label>
            <input
              id="valor"
              type="number"
              step="0.01"
              placeholder="Ex.: 200.00"
              disabled={enviando}
              {...register('valor', {
                setValueAs: (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
              })}
            />
            {errors.valor && <span className="field-error">{errors.valor.message}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="condicoes">Condições do serviço</label>
            <textarea
              id="condicoes"
              rows={4}
              placeholder="Ex.: Inclui materiais básicos. Início a partir de segunda-feira."
              disabled={enviando}
              {...register('condicoes')}
            />
            {errors.condicoes && <span className="field-error">{errors.condicoes.message}</span>}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar resposta'}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
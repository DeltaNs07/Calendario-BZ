import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useClanData } from '../../context/ClanDataContext';
import { MatchOutcome, UpcomingMatch } from '../../types/clan';

interface RecordResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: UpcomingMatch | null;
}

export const RecordResultModal: React.FC<RecordResultModalProps> = ({
  isOpen,
  onClose,
  match,
}) => {
  const { addHistoryMatch, deleteUpcomingMatch } = useClanData();

  const [ourScore, setOurScore] = useState('1000');
  const [opponentScore, setOpponentScore] = useState('750');
  const [outcome, setOutcome] = useState<MatchOutcome>('win');
  const [mvp, setMvp] = useState('');
  const [ticketsDifference, setTicketsDifference] = useState('+250 Tickets');
  const [notes, setNotes] = useState('');
  const [removeFromUpcoming, setRemoveFromUpcoming] = useState(true);

  useEffect(() => {
    if (match) {
      setMvp('BZT_MIGUEL (35 Kills)');
      setNotes(`Enfrentamiento oficial contra ${match.opponentName} en ${match.map}.`);
    }
  }, [match]);

  if (!isOpen || !match) return null;

  const autoOutcome = (ours: string, theirs: string) => {
    const a = parseInt(ours, 10) || 0;
    const b = parseInt(theirs, 10) || 0;
    setOutcome(a > b ? 'win' : a < b ? 'loss' : 'draw');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHistoryMatch({
      opponentName: match.opponentName,
      opponentTag: match.opponentTag,
      opponentLogo: match.opponentLogo,
      date: new Date().toISOString().slice(0, 10),
      modality: match.modality,
      map: match.map,
      ourScore: parseInt(ourScore, 10) || 0,
      opponentScore: parseInt(opponentScore, 10) || 0,
      outcome,
      mvp: mvp.trim(),
      ticketsDifference: ticketsDifference.trim(),
      notes: notes.trim(),
      vodLink: match.streamUrl || '',
    });
    if (removeFromUpcoming) {
      deleteUpcomingMatch(match.id);
    }
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg bg-[#10121c] border-t sm:border border-purple-500/40 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[90dvh] overflow-y-auto pb-safe"
      >
        <div className="w-10 h-1.5 bg-zinc-700 rounded-full mx-auto mb-4 sm:hidden" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-zinc-400 hover:text-white"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg uppercase text-white">
              Registrar Resultado del Versus
            </h3>
            <p className="text-xs text-zinc-400">
              Versus contra <span className="text-purple-300 font-bold">{match.opponentName}</span>{' '}
              · {match.modality}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Nuestro
              </label>
              <input
                type="number"
                required
                value={ourScore}
                onChange={(e) => {
                  setOurScore(e.target.value);
                  autoOutcome(e.target.value, opponentScore);
                }}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3 py-2 text-base text-emerald-300 font-bold font-mono-numbers focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Rival
              </label>
              <input
                type="number"
                required
                value={opponentScore}
                onChange={(e) => {
                  setOpponentScore(e.target.value);
                  autoOutcome(ourScore, e.target.value);
                }}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3 py-2 text-base text-rose-300 font-bold font-mono-numbers focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Estado
              </label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as MatchOutcome)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-2.5 py-2 text-sm text-white focus:outline-none"
              >
                <option value="win">Victoria</option>
                <option value="draw">Empate</option>
                <option value="loss">Derrota</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
              MVP del Encuentro
            </label>
            <input
              type="text"
              value={mvp}
              onChange={(e) => setMvp(e.target.value)}
              className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
              Detalle / Diferencia de Marcador
            </label>
            <input
              type="text"
              value={ticketsDifference}
              onChange={(e) => setTicketsDifference(e.target.value)}
              placeholder="Ej: +250 Tickets o Ronda 7-2"
              className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
              Resumen
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2.5 pt-1 text-xs text-zinc-300 cursor-pointer min-h-[40px]">
            <input
              type="checkbox"
              checked={removeFromUpcoming}
              onChange={(e) => setRemoveFromUpcoming(e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded"
            />
            <span>Archivar y quitar de los versus futuros (pasa directo al Historial oficial)</span>
          </label>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-heading font-semibold uppercase"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-heading font-bold uppercase shadow-lg shadow-emerald-950/40"
            >
              Confirmar Resultado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

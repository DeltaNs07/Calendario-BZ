import React, { useEffect, useState } from 'react';
import { Trophy, X } from 'lucide-react';
import { useClanData } from '../../context/ClanDataContext';
import { ASSET_IMAGES } from '../../data/defaultClanData';
import { HistoryMatch, MatchOutcome } from '../../types/clan';
import { playTapSound } from '../../utils/soundAndEffects';
import { ImageUploaderField } from '../ImageUploaderField';

interface HistoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchToEdit: HistoryMatch | null;
}

export const HistoryFormModal: React.FC<HistoryFormModalProps> = ({
  isOpen,
  onClose,
  matchToEdit,
}) => {
  const { addHistoryMatch, updateHistoryMatch } = useClanData();

  const [opponentName, setOpponentName] = useState('');
  const [opponentTag, setOpponentTag] = useState('');
  const [opponentLogo, setOpponentLogo] = useState(ASSET_IMAGES.rivalLogo);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [modality, setModality] = useState('Havoc Warfare 32v32');
  const [map, setMap] = useState('Presa Cero (Zero Dam)');
  const [ourScore, setOurScore] = useState('1000');
  const [opponentScore, setOpponentScore] = useState('720');
  const [outcome, setOutcome] = useState<MatchOutcome>('win');
  const [mvp, setMvp] = useState('');
  const [ticketsDifference, setTicketsDifference] = useState('+280 Tickets');
  const [notes, setNotes] = useState('');
  const [vodLink, setVodLink] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (matchToEdit) {
      setOpponentName(matchToEdit.opponentName);
      setOpponentTag(matchToEdit.opponentTag);
      setOpponentLogo(matchToEdit.opponentLogo || '');
      setDate(matchToEdit.date);
      setModality(matchToEdit.modality);
      setMap(matchToEdit.map);
      setOurScore(String(matchToEdit.ourScore));
      setOpponentScore(String(matchToEdit.opponentScore));
      setOutcome(matchToEdit.outcome);
      setMvp(matchToEdit.mvp);
      setTicketsDifference(matchToEdit.ticketsDifference);
      setNotes(matchToEdit.notes || '');
      setVodLink(matchToEdit.vodLink || '');
    } else {
      setOpponentName('');
      setOpponentTag('');
      setOpponentLogo(ASSET_IMAGES.rivalLogo);
      setDate(new Date().toISOString().slice(0, 10));
      setModality('Havoc Warfare 32v32');
      setMap('Presa Cero (Zero Dam)');
      setOurScore('1000');
      setOpponentScore('720');
      setOutcome('win');
      setMvp('BZT_MIGUEL');
      setTicketsDifference('+280 Tickets');
      setNotes('');
      setVodLink('');
    }
  }, [isOpen, matchToEdit]);

  if (!isOpen) return null;

  const autoOutcome = (ours: string, theirs: string) => {
    const a = parseInt(ours, 10) || 0;
    const b = parseInt(theirs, 10) || 0;
    setOutcome(a > b ? 'win' : a < b ? 'loss' : 'draw');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Omit<HistoryMatch, 'id'> = {
      opponentName: opponentName.trim() || 'CLAN RIVAL',
      opponentTag: opponentTag.trim() || '[RVL]',
      opponentLogo: opponentLogo.trim(),
      date,
      modality: modality.trim(),
      map: map.trim(),
      ourScore: parseInt(ourScore, 10) || 0,
      opponentScore: parseInt(opponentScore, 10) || 0,
      outcome,
      mvp: mvp.trim(),
      ticketsDifference: ticketsDifference.trim(),
      notes: notes.trim(),
      vodLink: vodLink.trim(),
    };

    if (matchToEdit) {
      updateHistoryMatch(matchToEdit.id, payload);
    } else {
      addHistoryMatch(payload);
    }
    playTapSound();
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-2xl bg-[#10121c] border-t sm:border border-purple-500/40 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[90dvh] overflow-y-auto pb-safe"
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
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg uppercase text-white">
              {matchToEdit ? 'Editar Partido en Récord' : 'Registrar Nuevo Partido'}
            </h3>
            <p className="text-xs text-zinc-400">
              Registra victorias, empates o derrotas en el historial oficial.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Nombre del Clan Rival
              </label>
              <input
                type="text"
                required
                value={opponentName}
                onChange={(e) => setOpponentName(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-base text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Tag Rival
              </label>
              <input
                type="text"
                required
                value={opponentTag}
                onChange={(e) => setOpponentTag(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-base text-white font-mono-numbers focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Marcador Nuestro
              </label>
              <input
                type="number"
                required
                value={ourScore}
                onChange={(e) => {
                  setOurScore(e.target.value);
                  autoOutcome(e.target.value, opponentScore);
                }}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-base text-emerald-300 font-bold font-mono-numbers focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Marcador Rival
              </label>
              <input
                type="number"
                required
                value={opponentScore}
                onChange={(e) => {
                  setOpponentScore(e.target.value);
                  autoOutcome(ourScore, e.target.value);
                }}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-base text-rose-300 font-bold font-mono-numbers focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Resultado
              </label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as MatchOutcome)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              >
                <option value="win">Victoria</option>
                <option value="draw">Empate</option>
                <option value="loss">Derrota</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Fecha
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Modalidad
              </label>
              <input
                type="text"
                required
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Mapa
              </label>
              <input
                type="text"
                required
                value={map}
                onChange={(e) => setMap(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                MVP del Partido
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
                Diferencia / Detalle
              </label>
              <input
                type="text"
                value={ticketsDifference}
                onChange={(e) => setTicketsDifference(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <ImageUploaderField
              label="Logo del Clan Rival"
              value={opponentLogo}
              onChange={setOpponentLogo}
              presets={[{ label: 'Emblema Rival', url: ASSET_IMAGES.rivalLogo }]}
              aspectRatio="square"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Enlace VOD (Opcional)
              </label>
              <input
                type="url"
                value={vodLink}
                onChange={(e) => setVodLink(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Notas
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

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
              className="min-h-[44px] px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-heading font-bold uppercase shadow-lg shadow-purple-950/40"
            >
              {matchToEdit ? 'Guardar Partido' : 'Registrar en Historial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

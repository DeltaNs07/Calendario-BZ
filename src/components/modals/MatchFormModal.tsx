import React, { useEffect, useState } from 'react';
import { Swords, X } from 'lucide-react';
import { useClanData } from '../../context/ClanDataContext';
import { ASSET_IMAGES } from '../../data/defaultClanData';
import { UpcomingMatch } from '../../types/clan';
import { playTapSound } from '../../utils/soundAndEffects';
import { ImageUploaderField } from '../ImageUploaderField';

interface MatchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchToEdit: UpcomingMatch | null;
}

export const MatchFormModal: React.FC<MatchFormModalProps> = ({
  isOpen,
  onClose,
  matchToEdit,
}) => {
  const { addUpcomingMatch, updateUpcomingMatch } = useClanData();

  const [opponentName, setOpponentName] = useState('');
  const [opponentTag, setOpponentTag] = useState('');
  const [opponentLogo, setOpponentLogo] = useState(ASSET_IMAGES.rivalLogo);
  const [matchDateLocal, setMatchDateLocal] = useState('');
  const [modality, setModality] = useState('Havoc Warfare 32v32');
  const [map, setMap] = useState('Presa Cero (Zero Dam)');
  const [serverRegion, setServerRegion] = useState('SA - São Paulo / Bogotá');
  const [tournamentName, setTournamentName] = useState('Scrim Oficial de Clanes');
  const [streamUrl, setStreamUrl] = useState('https://twitch.tv/baztardosgaming');
  const [caster, setCaster] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    if (matchToEdit) {
      setOpponentName(matchToEdit.opponentName);
      setOpponentTag(matchToEdit.opponentTag);
      setOpponentLogo(matchToEdit.opponentLogo || '');
      const d = new Date(matchToEdit.matchDate);
      const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setMatchDateLocal(localIso);
      setModality(matchToEdit.modality);
      setMap(matchToEdit.map);
      setServerRegion(matchToEdit.serverRegion);
      setTournamentName(matchToEdit.tournamentName || '');
      setStreamUrl(matchToEdit.streamUrl || '');
      setCaster(matchToEdit.caster || '');
      setNotes(matchToEdit.notes || '');
    } else {
      setOpponentName('');
      setOpponentTag('');
      setOpponentLogo(ASSET_IMAGES.rivalLogo);
      const d = new Date();
      d.setDate(d.getDate() + 2);
      d.setHours(20, 0, 0, 0);
      const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setMatchDateLocal(localIso);
      setModality('Havoc Warfare 32v32');
      setMap('Presa Cero (Zero Dam)');
      setServerRegion('SA - São Paulo / Bogotá');
      setTournamentName('Scrim Oficial de Clanes');
      setStreamUrl('https://twitch.tv/baztardosgaming');
      setCaster('');
      setNotes('');
    }
  }, [isOpen, matchToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const iso = matchDateLocal ? new Date(matchDateLocal).toISOString() : new Date().toISOString();
    const payload: Omit<UpcomingMatch, 'id'> = {
      opponentName: opponentName.trim() || 'RIVAL CLAN',
      opponentTag: opponentTag.trim() || '[RVL]',
      opponentLogo: opponentLogo.trim(),
      matchDate: iso,
      modality: modality.trim(),
      map: map.trim(),
      serverRegion: serverRegion.trim(),
      tournamentName: tournamentName.trim(),
      streamUrl: streamUrl.trim(),
      caster: caster.trim(),
      notes: notes.trim(),
    };

    if (matchToEdit) {
      updateUpcomingMatch(matchToEdit.id, payload);
    } else {
      addUpcomingMatch(payload);
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
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg uppercase text-white">
              {matchToEdit ? 'Editar Versus Programado' : 'Agendar Nuevo Versus'}
            </h3>
            <p className="text-xs text-zinc-400">
              Configura rival, fecha, hora y mapa para la cuenta regresiva.
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
                placeholder="Ej: VIPER SQUADRON"
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
                placeholder="[VPR]"
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-base text-white font-mono-numbers focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Fecha y Hora (tu hora local)
              </label>
              <input
                type="datetime-local"
                required
                value={matchDateLocal}
                onChange={(e) => setMatchDateLocal(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-base text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Torneo / Liga
              </label>
              <input
                type="text"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-base text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
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
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Región Servidor
              </label>
              <input
                type="text"
                value={serverRegion}
                onChange={(e) => setServerRegion(e.target.value)}
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
                Enlace de Transmisión (Opcional)
              </label>
              <input
                type="url"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Caster / Transmite (Opcional)
              </label>
              <input
                type="text"
                value={caster}
                onChange={(e) => setCaster(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
              Notas Tácticas
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
            />
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
              {matchToEdit ? 'Guardar Cambios' : 'Programar Versus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

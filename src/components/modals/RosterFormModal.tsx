import React, { useEffect, useState } from 'react';
import { Users, X } from 'lucide-react';
import { useClanData } from '../../context/ClanDataContext';
import { RosterMember } from '../../types/clan';
import { playTapSound } from '../../utils/soundAndEffects';
import { ImageUploaderField } from '../ImageUploaderField';

interface RosterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit: RosterMember | null;
}

export const RosterFormModal: React.FC<RosterFormModalProps> = ({
  isOpen,
  onClose,
  memberToEdit,
}) => {
  const { addRosterMember, updateRosterMember } = useClanData();

  const [gamertag, setGamertag] = useState('');
  const [realName, setRealName] = useState('');
  const [role, setRole] = useState('Asalto / Fragger');
  const [favoriteOperator, setFavoriteOperator] = useState('D-Wolf (Kai Silva)');
  const [favoriteWeapon, setFavoriteWeapon] = useState('M4A1 Carbine Mod');
  const [rank, setRank] = useState('Coronel');
  const [kdRatio, setKdRatio] = useState('2.50');
  const [matchesPlayed, setMatchesPlayed] = useState('150');
  const [winRate, setWinRate] = useState('78');
  const [country, setCountry] = useState('Colombia');
  const [countryCode, setCountryCode] = useState('CO');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isStarter, setIsStarter] = useState(true);
  const [joinDate, setJoinDate] = useState('Noviembre 2026');

  useEffect(() => {
    if (!isOpen) return;
    if (memberToEdit) {
      setGamertag(memberToEdit.gamertag);
      setRealName(memberToEdit.realName || '');
      setRole(memberToEdit.role);
      setFavoriteOperator(memberToEdit.favoriteOperator);
      setFavoriteWeapon(memberToEdit.favoriteWeapon);
      setRank(memberToEdit.rank);
      setKdRatio(String(memberToEdit.kdRatio));
      setMatchesPlayed(String(memberToEdit.matchesPlayed));
      setWinRate(String(memberToEdit.winRate));
      setCountry(memberToEdit.country);
      setCountryCode(memberToEdit.countryCode);
      setAvatarUrl(memberToEdit.avatarUrl);
      setIsStarter(memberToEdit.isStarter);
      setJoinDate(memberToEdit.joinDate);
    } else {
      setGamertag('');
      setRealName('');
      setRole('Asalto / Fragger');
      setFavoriteOperator('D-Wolf (Kai Silva)');
      setFavoriteWeapon('M4A1 Carbine Mod');
      setRank('Coronel');
      setKdRatio('2.50');
      setMatchesPlayed('150');
      setWinRate('78');
      setCountry('Colombia');
      setCountryCode('CO');
      setAvatarUrl('');
      setIsStarter(true);
      setJoinDate('Noviembre 2026');
    }
  }, [isOpen, memberToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Omit<RosterMember, 'id'> = {
      gamertag: gamertag.trim() || 'BZT_OPERADOR',
      realName: realName.trim(),
      role: role.trim(),
      favoriteOperator: favoriteOperator.trim(),
      favoriteWeapon: favoriteWeapon.trim(),
      rank: rank.trim(),
      kdRatio: parseFloat(kdRatio) || 2.0,
      matchesPlayed: parseInt(matchesPlayed, 10) || 100,
      winRate: parseFloat(winRate) || 75,
      country: country.trim() || 'Colombia',
      countryCode: countryCode.trim() || 'CO',
      avatarUrl: avatarUrl.trim(),
      isStarter,
      joinDate: joinDate.trim() || 'Reciente',
    };

    if (memberToEdit) {
      updateRosterMember(memberToEdit.id, payload);
    } else {
      addRosterMember(payload);
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
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg uppercase text-white">
              {memberToEdit ? 'Editar Operador' : 'Añadir Nuevo Operador'}
            </h3>
            <p className="text-xs text-zinc-400">
              Actualiza gamertag, rol, operador, armamento, métricas y foto.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Gamertag
              </label>
              <input
                type="text"
                required
                value={gamertag}
                onChange={(e) => setGamertag(e.target.value)}
                placeholder="BZT_OPERADOR"
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-base text-white font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Nombre Real / Alias (Opcional)
              </label>
              <input
                type="text"
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-base text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Rol en el Clan
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              >
                <option value="Líder / IGL">Líder / IGL</option>
                <option value="Co-Líder">Co-Líder</option>
                <option value="Asalto / Fragger">Asalto / Fragger</option>
                <option value="Recon / Sniper">Recon / Sniper</option>
                <option value="Support / Médico">Support / Médico</option>
                <option value="Ingeniero / Tanquista">Ingeniero / Tanquista</option>
                <option value="Suplente / Reserva">Suplente / Reserva</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Rango Competitivo
              </label>
              <input
                type="text"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Operador Favorito
              </label>
              <input
                type="text"
                value={favoriteOperator}
                onChange={(e) => setFavoriteOperator(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Arma Principal
              </label>
              <input
                type="text"
                value={favoriteWeapon}
                onChange={(e) => setFavoriteWeapon(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                K/D Ratio
              </label>
              <input
                type="number"
                step="0.01"
                value={kdRatio}
                onChange={(e) => setKdRatio(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white font-mono-numbers focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Partidas
              </label>
              <input
                type="number"
                value={matchesPlayed}
                onChange={(e) => setMatchesPlayed(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white font-mono-numbers focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Win %
              </label>
              <input
                type="number"
                step="0.1"
                value={winRate}
                onChange={(e) => setWinRate(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white font-mono-numbers focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                País
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-zinc-200 min-h-[44px]">
                <input
                  type="checkbox"
                  checked={isStarter}
                  onChange={(e) => setIsStarter(e.target.checked)}
                  className="w-5 h-5 accent-purple-600 rounded"
                />
                Alineación Titular (Activo)
              </label>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <ImageUploaderField
              label="Foto / Avatar del Jugador"
              value={avatarUrl}
              onChange={setAvatarUrl}
              aspectRatio="square"
              helperText="Sube una foto desde tu dispositivo o deja vacío para usar sus iniciales tácticas."
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
              {memberToEdit ? 'Guardar Operador' : 'Añadir al Roster'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

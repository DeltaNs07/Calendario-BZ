import React, { useEffect, useState } from 'react';
import { Settings, X } from 'lucide-react';
import { useClanData } from '../../context/ClanDataContext';
import { ASSET_IMAGES } from '../../data/defaultClanData';
import { playTapSound } from '../../utils/soundAndEffects';
import { ImageUploaderField } from '../ImageUploaderField';

interface ClanInfoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClanInfoFormModal: React.FC<ClanInfoFormModalProps> = ({ isOpen, onClose }) => {
  const { state, updateClanInfo } = useClanData();
  const info = state.info;

  const [name, setName] = useState(info.name);
  const [tag, setTag] = useState(info.tag);
  const [motto, setMotto] = useState(info.motto);
  const [game, setGame] = useState(info.game);
  const [server, setServer] = useState(info.server);
  const [foundedYear, setFoundedYear] = useState(info.foundedYear);
  const [logoUrl, setLogoUrl] = useState(info.logoUrl);
  const [bannerUrl, setBannerUrl] = useState(info.bannerUrl);
  const [discordUrl, setDiscordUrl] = useState(info.discordUrl || '');
  const [whatsappUrl, setWhatsappUrl] = useState(info.whatsappUrl || '');
  const [youtubeUrl, setYoutubeUrl] = useState(info.youtubeUrl || '');
  const [tiktokUrl, setTiktokUrl] = useState(info.tiktokUrl || '');
  const [announcement, setAnnouncement] = useState(info.announcement || '');
  const [recruitmentOpen, setRecruitmentOpen] = useState(info.recruitmentOpen);
  const [requirementsText, setRequirementsText] = useState(
    (info.recruitmentRequirements || []).join('\n')
  );

  useEffect(() => {
    if (isOpen) {
      setName(info.name);
      setTag(info.tag);
      setMotto(info.motto);
      setGame(info.game);
      setServer(info.server);
      setFoundedYear(info.foundedYear);
      setLogoUrl(info.logoUrl);
      setBannerUrl(info.bannerUrl);
      setDiscordUrl(info.discordUrl || '');
      setWhatsappUrl(info.whatsappUrl || '');
      setYoutubeUrl(info.youtubeUrl || '');
      setTiktokUrl(info.tiktokUrl || '');
      setAnnouncement(info.announcement || '');
      setRecruitmentOpen(info.recruitmentOpen);
      setRequirementsText((info.recruitmentRequirements || []).join('\n'));
    }
  }, [info, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requirements = requirementsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    updateClanInfo({
      name: name.trim() || 'BAZTARDOS GAMING',
      tag: tag.trim() || '[BZT]',
      motto: motto.trim(),
      game: game.trim() || 'Garena Delta Force: Hawk Ops',
      server: server.trim() || 'Latinoamérica / Global',
      foundedYear: foundedYear.trim() || '2024',
      logoUrl: logoUrl.trim() || ASSET_IMAGES.logoPurple,
      bannerUrl: bannerUrl.trim() || ASSET_IMAGES.heroPurple,
      discordUrl: discordUrl.trim(),
      whatsappUrl: whatsappUrl.trim(),
      youtubeUrl: youtubeUrl.trim(),
      tiktokUrl: tiktokUrl.trim(),
      announcement: announcement.trim(),
      recruitmentOpen,
      recruitmentRequirements: requirements,
      customAdminPin: '2507',
    });
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
        className="w-full sm:max-w-3xl bg-[#10121c] border-t sm:border border-purple-500/40 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[90dvh] overflow-y-auto pb-safe"
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
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg uppercase text-white">
              Editar Información General del Clan
            </h3>
            <p className="text-xs text-zinc-400">
              Personaliza nombre, logo, lema, portada, comunicado y requisitos.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Nombre del Clan
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-base text-white font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Tag Oficial
              </label>
              <input
                type="text"
                required
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-base text-white font-mono-numbers focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Juego Principal
              </label>
              <input
                type="text"
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Región / Servidor
              </label>
              <input
                type="text"
                value={server}
                onChange={(e) => setServer(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Año de Fundación
              </label>
              <input
                type="text"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
              Lema de Batalla
            </label>
            <input
              type="text"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-base text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
              Comunicado Superior / Anuncio del Día (Barra Hero)
            </label>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              placeholder="Ej: Próxima Scrim oficial este viernes a las 20:00 Col..."
              className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-base text-purple-200 focus:outline-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <ImageUploaderField
              label="Logo del Clan"
              value={logoUrl}
              onChange={setLogoUrl}
              presets={[{ label: 'Escudo Morado [BZT]', url: ASSET_IMAGES.logoPurple }]}
              aspectRatio="square"
              helperText="Sube imagen PNG/JPG o elige un preestablecido."
            />
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <ImageUploaderField
              label="Banner de Portada / Fondo Hero"
              value={bannerUrl}
              onChange={setBannerUrl}
              presets={[
                { label: 'Presa Nocturna Morada', url: ASSET_IMAGES.heroPurple },
                { label: 'Presa Cero Táctica', url: ASSET_IMAGES.mapZeroDam },
              ]}
              aspectRatio="banner"
              helperText="Formato panorámico para el fondo de portada."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Discord Oficial
              </label>
              <input
                type="url"
                value={discordUrl}
                onChange={(e) => setDiscordUrl(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                WhatsApp del Clan
              </label>
              <input
                type="url"
                value={whatsappUrl}
                onChange={(e) => setWhatsappUrl(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Canal de YouTube
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                TikTok Oficial
              </label>
              <input
                type="url"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <label className="text-xs font-heading font-semibold uppercase text-zinc-300">
                Requisitos de Reclutamiento (1 por línea)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-200 min-h-[36px]">
                <input
                  type="checkbox"
                  checked={recruitmentOpen}
                  onChange={(e) => setRecruitmentOpen(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded"
                />
                Reclutamiento Abierto
              </label>
            </div>
            <textarea
              rows={4}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              className="w-full bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-heading font-semibold uppercase text-zinc-200">
                Código Maestro de Acceso Admin
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Acceso protegido exclusivamente con el código 2507.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-300 bg-purple-950/60 border border-purple-500/35 px-3 py-1.5 rounded-lg shrink-0">
              Blindado (2507)
            </span>
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
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

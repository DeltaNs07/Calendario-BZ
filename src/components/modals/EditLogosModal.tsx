import React, { useEffect, useState } from 'react';
import { CheckCircle2, Image as ImageIcon, X } from 'lucide-react';
import { useClanData } from '../../context/ClanDataContext';
import { ASSET_IMAGES } from '../../data/defaultClanData';
import { playTapSound } from '../../utils/soundAndEffects';
import { ImageUploaderField } from '../ImageUploaderField';

interface EditLogosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditLogosModal: React.FC<EditLogosModalProps> = ({ isOpen, onClose }) => {
  const { state, updateClanInfo } = useClanData();
  const [logoUrl, setLogoUrl] = useState(state.info.logoUrl);
  const [bannerUrl, setBannerUrl] = useState(state.info.bannerUrl);

  useEffect(() => {
    if (isOpen) {
      setLogoUrl(state.info.logoUrl);
      setBannerUrl(state.info.bannerUrl);
    }
  }, [isOpen, state.info.logoUrl, state.info.bannerUrl]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClanInfo({
      logoUrl: logoUrl.trim() || ASSET_IMAGES.logoPurple,
      bannerUrl: bannerUrl.trim() || ASSET_IMAGES.heroPurple,
    });
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-2xl bg-[#10121c] border-t sm:border border-purple-500/40 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl max-h-[90dvh] overflow-y-auto relative pb-safe"
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
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg uppercase text-white">
              Editar Logos & Portada
            </h3>
            <p className="text-xs text-zinc-400">
              Cambia el escudo del clan y el fondo principal de la web.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <ImageUploaderField
              label="Logo Oficial del Clan"
              value={logoUrl}
              onChange={setLogoUrl}
              presets={[
                { label: 'Escudo Morado [BZT]', url: ASSET_IMAGES.logoPurple },
                { label: 'Emblema Rival', url: ASSET_IMAGES.rivalLogo },
              ]}
              aspectRatio="square"
              helperText="Imagen cuadrada (PNG o JPG). Puedes subirla directo desde tu Android."
            />
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <ImageUploaderField
              label="Banner de Fondo Hero / Portada"
              value={bannerUrl}
              onChange={setBannerUrl}
              presets={[
                { label: 'Presa Nocturna Morada', url: ASSET_IMAGES.heroPurple },
                { label: 'Operativo Presa Cero', url: ASSET_IMAGES.mapZeroDam },
                { label: 'Arena Torneo', url: ASSET_IMAGES.squadGallery },
              ]}
              aspectRatio="banner"
              helperText="Formato panorámico (16:9) mostrado detrás de la cuenta regresiva."
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              Los cambios se actualizan al instante en toda la web.
            </span>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-heading font-semibold uppercase"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={() => playTapSound()}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-heading font-bold uppercase shadow-lg shadow-purple-950/40"
              >
                Guardar Logos
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

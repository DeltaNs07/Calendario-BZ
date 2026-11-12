import React, { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { useClanData } from '../../context/ClanDataContext';
import { ASSET_IMAGES } from '../../data/defaultClanData';
import { GalleryCategory } from '../../types/clan';
import { playTapSound } from '../../utils/soundAndEffects';
import { ImageUploaderField } from '../ImageUploaderField';

interface GalleryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GalleryFormModal: React.FC<GalleryFormModalProps> = ({ isOpen, onClose }) => {
  const { addGalleryItem } = useClanData();

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState(ASSET_IMAGES.heroPurple);
  const [category, setCategory] = useState<GalleryCategory>('victorias');
  const [date, setDate] = useState('Noviembre 2026');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGalleryItem({
      title: title.trim() || 'Captura de Combate',
      caption: caption.trim() || 'Momento destacado de la escuadra.',
      imageUrl: imageUrl.trim() || ASSET_IMAGES.heroPurple,
      category,
      date: date.trim() || 'Reciente',
    });
    setTitle('');
    setCaption('');
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
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg uppercase text-white">
              Añadir Captura a la Galería
            </h3>
            <p className="text-xs text-zinc-400">
              Sube fotos desde tu teléfono Android o usa enlaces directos.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
              Título de la Captura
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Campeones Regionales Havoc"
              className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-base text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
              Descripción / Pie de Foto
            </label>
            <textarea
              rows={2}
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe este momento..."
              className="w-full bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              >
                <option value="victorias">Victorias</option>
                <option value="torneos">Torneos & Copas</option>
                <option value="jugadas">Jugadas Épicas</option>
                <option value="comunidad">Comunidad</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-heading font-semibold uppercase text-zinc-300 mb-1">
                Fecha / Período
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <ImageUploaderField
              label="Archivo de Imagen"
              value={imageUrl}
              onChange={setImageUrl}
              presets={[
                { label: 'Noche Morada', url: ASSET_IMAGES.heroPurple },
                { label: 'Presa Cero', url: ASSET_IMAGES.mapZeroDam },
                { label: 'Arena Torneo', url: ASSET_IMAGES.squadGallery },
              ]}
              aspectRatio="video"
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
              Guardar en Galería
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, X } from 'lucide-react';
import { useClanData } from '../context/ClanDataContext';
import { GalleryCategory, GalleryItem } from '../types/clan';
import { playTapSound } from '../utils/soundAndEffects';
import { SmartImage } from './SmartImage';
import { EditableText, EditableValue } from './EditableText';

interface GallerySectionProps {
  onAddImage: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onAddImage }) => {
  const { state, isAdmin, deleteGalleryItem } = useClanData();
  const [filter, setFilter] = useState<'all' | GalleryCategory>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const g = state.texts.gallery;

  const filteredItems = state.gallery.filter(
    (item) => filter === 'all' || item.category === filter
  );

  const categories: { id: 'all' | GalleryCategory; field: keyof typeof g; label: string }[] = [
    { id: 'all', field: 'filterAll', label: g.filterAll },
    { id: 'victorias', field: 'catVictorias', label: g.catVictorias },
    { id: 'torneos', field: 'catTorneos', label: g.catTorneos },
    { id: 'jugadas', field: 'catJugadas', label: g.catJugadas },
    { id: 'comunidad', field: 'catComunidad', label: g.catComunidad },
  ];

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 font-heading mb-1">
            <ImageIcon className="w-4 h-4" />
            <EditableText section="gallery" field="kicker" label="Kicker Galería" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading">
            <EditableText section="gallery" field="title" label="Título Galería" />
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            <EditableText section="gallery" field="subtitle" label="Subtítulo Galería" multiline />
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              onAddImage();
              playTapSound();
            }}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors self-start sm:self-auto shadow-md shadow-purple-950/40"
          >
            <Plus className="w-4 h-4" />
            <EditableText section="gallery" field="addBtn" label="Botón Subir Captura" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setFilter(cat.id);
              playTapSound();
            }}
            className={`min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider whitespace-nowrap shrink-0 border transition-colors ${
              filter === cat.id
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-zinc-900 text-zinc-300 border-white/10 hover:text-white'
            }`}
          >
            <EditableText section="gallery" field={cat.field} label={`Categoría ${cat.label}`} />
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#10121b] border border-white/10 rounded-3xl p-8 text-center">
          <ImageIcon className="w-10 h-10 text-purple-400 mx-auto mb-3" />
          <p className="text-sm text-zinc-300">
            <EditableText section="gallery" field="emptyTitle" label="Mensaje galería vacía" />
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="bg-[#10121b] border border-white/10 hover:border-purple-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-colors"
            >
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setLightboxItem(item);
                    playTapSound();
                  }}
                  className="block w-full aspect-[4/3] bg-black overflow-hidden text-left group"
                >
                  <SmartImage
                    src={item.imageUrl}
                    alt={item.title}
                    fallbackText={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </button>
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-purple-400 font-heading uppercase mb-1">
                    <span>{item.category}</span>
                    <EditableValue
                      value={item.date}
                      target={{
                        kind: 'galleryItem',
                        id: item.id,
                        field: 'date',
                        label: 'Fecha de la Captura',
                      }}
                      className="text-zinc-400 font-sans"
                    />
                  </div>
                  <h3 className="font-heading font-bold text-base text-white uppercase">
                    <EditableValue
                      value={item.title}
                      target={{
                        kind: 'galleryItem',
                        id: item.id,
                        field: 'title',
                        label: 'Título de la Captura',
                      }}
                    />
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                    <EditableValue
                      value={item.caption}
                      target={{
                        kind: 'galleryItem',
                        id: item.id,
                        field: 'caption',
                        label: 'Descripción de la Captura',
                        multiline: true,
                      }}
                    />
                  </p>
                </div>
              </div>

              {isAdmin && (
                <div className="px-4 py-2.5 border-t border-white/10 bg-black/35 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Eliminar la imagen "${item.title}"?`)) {
                        deleteGalleryItem(item.id);
                      }
                    }}
                    title="Eliminar foto"
                    className="min-h-[38px] px-3 rounded-lg text-xs text-zinc-300 hover:text-rose-400 hover:bg-white/5 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-3 sm:p-8 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#10121c] border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setLightboxItem(null)}
              className="absolute top-3 right-3 z-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/70 text-white hover:text-purple-300"
              aria-label="Cerrar imagen"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[65vh] bg-black flex items-center justify-center overflow-hidden">
              <SmartImage
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                fallbackText={lightboxItem.title}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>
            <div className="p-5 sm:p-6">
              <div className="text-xs uppercase font-heading text-purple-400 font-bold mb-1">
                {lightboxItem.category} · {lightboxItem.date}
              </div>
              <h3 className="text-lg sm:text-xl font-bold uppercase text-white font-heading">
                {lightboxItem.title}
              </h3>
              <p className="text-sm text-zinc-300 mt-1.5">{lightboxItem.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

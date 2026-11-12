import React, { useEffect, useState } from 'react';
import { Check, RotateCcw, Type, X } from 'lucide-react';
import { useClanData } from '../context/ClanDataContext';
import { DEFAULT_TEXTS, TEXT_SECTION_LABELS } from '../data/defaultClanData';

export const QuickTextEditModal: React.FC = () => {
  const {
    state,
    editingTextTarget,
    closeQuickTextEdit,
    setSingleSiteText,
  } = useClanData();

  const [value, setValue] = useState('');

  useEffect(() => {
    if (!editingTextTarget) return;
    const sectionObj = state.texts[editingTextTarget.section] as unknown as Record<string, unknown>;
    const current = sectionObj?.[editingTextTarget.field];
    setValue(typeof current === 'string' ? current : '');
  }, [editingTextTarget, state.texts]);

  if (!editingTextTarget) return null;

  const defaultSectionObj = DEFAULT_TEXTS[editingTextTarget.section] as unknown as Record<string, unknown>;
  const defaultVal =
    typeof defaultSectionObj?.[editingTextTarget.field] === 'string'
      ? (defaultSectionObj[editingTextTarget.field] as string)
      : '';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSingleSiteText(editingTextTarget.section, editingTextTarget.field, value);
    closeQuickTextEdit();
  };

  return (
    <div
      onClick={closeQuickTextEdit}
      className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg bg-[#10121c] border-t sm:border border-purple-500/40 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl pb-safe"
      >
        <div className="w-10 h-1.5 bg-zinc-700 rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
              <Type className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                {TEXT_SECTION_LABELS[editingTextTarget.section]}
              </div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                {editingTextTarget.label}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={closeQuickTextEdit}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/5"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Texto visible en la web
            </label>
            {editingTextTarget.multiline ? (
              <textarea
                rows={4}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                className="w-full bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-3 text-base text-white focus:outline-none"
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoFocus
                className="w-full min-h-[46px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-base text-white focus:outline-none"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setValue(defaultVal)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar original
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={closeQuickTextEdit}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-purple-950/50"
              >
                <Check className="w-4 h-4" />
                Guardar Texto
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

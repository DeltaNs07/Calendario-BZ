import React, { useEffect, useState } from 'react';
import { Check, RotateCcw, Type, X } from 'lucide-react';
import { InlineEditTarget, useClanData } from '../context/ClanDataContext';
import {
  DEFAULT_CLAN_STATE,
  DEFAULT_TEXTS,
  TEXT_SECTION_LABELS,
} from '../data/defaultClanData';

function getCurrentValueAndDefault(
  state: ReturnType<typeof useClanData>['state'],
  target: InlineEditTarget
): { current: string; fallback: string | null; categoryTitle: string; multiline: boolean } {
  switch (target.kind) {
    case 'siteText': {
      const sectionObj = state.texts[target.section] as unknown as Record<string, unknown>;
      const defSectionObj = DEFAULT_TEXTS[target.section] as unknown as Record<string, unknown>;
      return {
        current: typeof sectionObj?.[target.field] === 'string' ? (sectionObj[target.field] as string) : '',
        fallback:
          typeof defSectionObj?.[target.field] === 'string'
            ? (defSectionObj[target.field] as string)
            : '',
        categoryTitle: TEXT_SECTION_LABELS[target.section],
        multiline: Boolean(target.multiline),
      };
    }
    case 'clanInfo': {
      return {
        current: state.info[target.field] || '',
        fallback: DEFAULT_CLAN_STATE.info[target.field] || '',
        categoryTitle: 'Información del Clan',
        multiline: Boolean(target.multiline),
      };
    }
    case 'requirement': {
      return {
        current: state.info.recruitmentRequirements[target.index] || '',
        fallback: DEFAULT_CLAN_STATE.info.recruitmentRequirements[target.index] ?? null,
        categoryTitle: 'Requisitos de Postulación',
        multiline: true,
      };
    }
    case 'rule': {
      const rule = state.texts.info.rules[target.index];
      const defRule = DEFAULT_TEXTS.info.rules[target.index];
      return {
        current: rule ? rule[target.key] : '',
        fallback: defRule ? defRule[target.key] : null,
        categoryTitle: 'Código de Conducta',
        multiline: Boolean(target.multiline),
      };
    }
    case 'mapStat': {
      const item = state.texts.stats.mapStats[target.index];
      const defItem = DEFAULT_TEXTS.stats.mapStats[target.index];
      return {
        current: item ? String(item[target.key]) : '',
        fallback: defItem ? String(defItem[target.key]) : null,
        categoryTitle: 'Efectividad por Mapa',
        multiline: false,
      };
    }
    case 'upcomingMatch': {
      const match = state.upcomingMatches.find((m) => m.id === target.id);
      return {
        current: match ? String(match[target.field] || '') : '',
        fallback: null,
        categoryTitle: 'Versus Programado',
        multiline: Boolean(target.multiline),
      };
    }
    case 'rosterMember': {
      const member = state.roster.find((m) => m.id === target.id);
      return {
        current: member ? String(member[target.field] || '') : '',
        fallback: null,
        categoryTitle: 'Operador del Roster',
        multiline: false,
      };
    }
    case 'historyMatch': {
      const match = state.history.find((m) => m.id === target.id);
      return {
        current: match ? String(match[target.field] || '') : '',
        fallback: null,
        categoryTitle: 'Historial de Partidos',
        multiline: Boolean(target.multiline),
      };
    }
    case 'galleryItem': {
      const item = state.gallery.find((g) => g.id === target.id);
      return {
        current: item ? String(item[target.field] || '') : '',
        fallback: null,
        categoryTitle: 'Galería Táctica',
        multiline: Boolean(target.multiline),
      };
    }
  }
}

export const QuickTextEditModal: React.FC = () => {
  const {
    state,
    editingTextTarget,
    closeQuickTextEdit,
    setSingleSiteText,
    updateClanInfo,
    updateSiteTexts,
    updateUpcomingMatch,
    updateRosterMember,
    updateHistoryMatch,
    updateGalleryItem,
  } = useClanData();

  const [value, setValue] = useState('');

  useEffect(() => {
    if (!editingTextTarget) return;
    const info = getCurrentValueAndDefault(state, editingTextTarget);
    setValue(info.current);
  }, [editingTextTarget, state]);

  if (!editingTextTarget) return null;

  const { fallback, categoryTitle, multiline } = getCurrentValueAndDefault(
    state,
    editingTextTarget
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    switch (editingTextTarget.kind) {
      case 'siteText':
        setSingleSiteText(editingTextTarget.section, editingTextTarget.field, value);
        break;
      case 'clanInfo':
        updateClanInfo({ [editingTextTarget.field]: value });
        break;
      case 'requirement': {
        const nextReqs = [...state.info.recruitmentRequirements];
        nextReqs[editingTextTarget.index] = value.trim();
        updateClanInfo({ recruitmentRequirements: nextReqs.filter(Boolean) });
        break;
      }
      case 'rule': {
        const nextRules = state.texts.info.rules.map((r, i) =>
          i === editingTextTarget.index ? { ...r, [editingTextTarget.key]: value } : r
        );
        updateSiteTexts('info', { rules: nextRules });
        break;
      }
      case 'mapStat': {
        const nextMaps = state.texts.stats.mapStats.map((m, i) =>
          i === editingTextTarget.index ? { ...m, [editingTextTarget.key]: value } : m
        );
        updateSiteTexts('stats', { mapStats: nextMaps });
        break;
      }
      case 'upcomingMatch':
        updateUpcomingMatch(editingTextTarget.id, { [editingTextTarget.field]: value });
        break;
      case 'rosterMember':
        updateRosterMember(editingTextTarget.id, { [editingTextTarget.field]: value });
        break;
      case 'historyMatch':
        updateHistoryMatch(editingTextTarget.id, { [editingTextTarget.field]: value });
        break;
      case 'galleryItem':
        updateGalleryItem(editingTextTarget.id, { [editingTextTarget.field]: value });
        break;
    }
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
                {categoryTitle}
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
              Texto en pantalla
            </label>
            {multiline ? (
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
            {fallback !== null && (
              <button
                type="button"
                onClick={() => setValue(fallback)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restaurar original
              </button>
            )}
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

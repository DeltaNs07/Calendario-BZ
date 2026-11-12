import React, { useMemo, useState } from 'react';
import { Check, Pencil, RotateCcw, Search, Type } from 'lucide-react';
import { useClanData } from '../../context/ClanDataContext';
import {
  DEFAULT_TEXTS,
  TEXT_EDITOR_FIELDS,
  TEXT_SECTION_LABELS,
} from '../../data/defaultClanData';
import { ClanRuleItem, MapStatItem, SiteTexts } from '../../types/clan';
import { playTapSound } from '../../utils/soundAndEffects';

interface SiteTextsEditorTabProps {
  onEnableLiveInlineMode: () => void;
}

export const SiteTextsEditorTab: React.FC<SiteTextsEditorTabProps> = ({
  onEnableLiveInlineMode,
}) => {
  const { state, setSingleSiteText, updateSiteTexts, resetSiteTexts } = useClanData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'all' | keyof SiteTexts>('all');
  const [savedNotice, setSavedNotice] = useState(false);

  const sectionKeys = Object.keys(TEXT_SECTION_LABELS) as (keyof SiteTexts)[];

  const filteredFields = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TEXT_EDITOR_FIELDS.filter((spec) => {
      if (activeSection !== 'all' && spec.section !== activeSection) return false;
      if (!q) return true;
      const sectionObj = state.texts[spec.section] as unknown as Record<string, unknown>;
      const val = typeof sectionObj?.[spec.field] === 'string' ? (sectionObj[spec.field] as string) : '';
      return (
        spec.label.toLowerCase().includes(q) ||
        val.toLowerCase().includes(q) ||
        TEXT_SECTION_LABELS[spec.section].toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeSection, state.texts]);

  const handleFieldChange = (section: keyof SiteTexts, field: string, value: string) => {
    setSingleSiteText(section, field, value);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1600);
  };

  const handleRuleChange = (index: number, key: keyof ClanRuleItem, value: string) => {
    const updated = state.texts.info.rules.map((rule, i) =>
      i === index ? { ...rule, [key]: value } : rule
    );
    updateSiteTexts('info', { rules: updated });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1600);
  };

  const handleMapStatChange = (
    index: number,
    key: keyof MapStatItem,
    value: string
  ) => {
    const updated = state.texts.stats.mapStats.map((item, i) => {
      if (i !== index) return item;
      if (key === 'winRate' || key === 'played') {
        return { ...item, [key]: parseInt(value, 10) || 0 };
      }
      return { ...item, [key]: value };
    });
    updateSiteTexts('stats', { mapStats: updated });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1600);
  };

  const showRulesEditor =
    (activeSection === 'all' || activeSection === 'info') &&
    (!searchQuery.trim() || 'reglas conducta'.includes(searchQuery.trim().toLowerCase()));

  const showMapsEditor =
    (activeSection === 'all' || activeSection === 'stats') &&
    (!searchQuery.trim() || 'mapa efectividad'.includes(searchQuery.trim().toLowerCase()));

  return (
    <div className="space-y-5">
      {/* Top Action Banner */}
      <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-heading font-bold text-sm uppercase text-white flex items-center gap-2">
            <Type className="w-4 h-4 text-purple-400" />
            Editor Total de Textos de la Página
          </h4>
          <p className="text-xs text-zinc-300 mt-0.5">
            Cambia cualquier título, botón, etiqueta, regla o mensaje sin afectar tus partidos, roster o logos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              onEnableLiveInlineMode();
              playTapSound();
            }}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-purple-950/40"
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar Tocando en Vivo
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('¿Restaurar todos los textos de la web a sus valores originales? (Tus partidos, roster y logos no cambiarán)')) {
                resetSiteTexts();
              }
            }}
            className="min-h-[40px] px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar Textos
          </button>
        </div>
      </div>

      {/* Search & Section Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cualquier texto de la página (ej: Escuadrón, Récord, Reglas)..."
              className="w-full min-h-[44px] bg-black/60 border border-zinc-700 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none"
            />
          </div>
          {savedNotice && (
            <span className="shrink-0 text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" />
              Guardado
            </span>
          )}
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => {
              setActiveSection('all');
              playTapSound();
            }}
            className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-heading font-semibold uppercase whitespace-nowrap shrink-0 border ${
              activeSection === 'all'
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-zinc-900 text-zinc-300 border-white/10 hover:text-white'
            }`}
          >
            Todas ({TEXT_EDITOR_FIELDS.length})
          </button>
          {sectionKeys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setActiveSection(key);
                playTapSound();
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-heading font-semibold uppercase whitespace-nowrap shrink-0 border ${
                activeSection === key
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-zinc-900 text-zinc-300 border-white/10 hover:text-white'
              }`}
            >
              {TEXT_SECTION_LABELS[key].split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Text Fields List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredFields.map((spec) => {
          const sectionObj = state.texts[spec.section] as unknown as Record<string, unknown>;
          const defaultSectionObj = DEFAULT_TEXTS[spec.section] as unknown as Record<string, unknown>;
          const currentVal =
            typeof sectionObj?.[spec.field] === 'string'
              ? (sectionObj[spec.field] as string)
              : '';
          const defaultVal =
            typeof defaultSectionObj?.[spec.field] === 'string'
              ? (defaultSectionObj[spec.field] as string)
              : '';
          const isModified = currentVal !== defaultVal;

          return (
            <div
              key={`${spec.section}.${spec.field}`}
              className="p-3.5 rounded-xl bg-black/45 border border-white/10 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                    {TEXT_SECTION_LABELS[spec.section]}
                  </span>
                  <div className="text-xs font-semibold text-zinc-200">{spec.label}</div>
                </div>
                {isModified && (
                  <button
                    type="button"
                    onClick={() => handleFieldChange(spec.section, spec.field, defaultVal)}
                    title="Restaurar este texto"
                    className="min-h-[32px] px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 flex items-center gap-1 shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Original
                  </button>
                )}
              </div>

              {spec.multiline ? (
                <textarea
                  rows={2}
                  value={currentVal}
                  onChange={(e) => handleFieldChange(spec.section, spec.field, e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              ) : (
                <input
                  type="text"
                  value={currentVal}
                  onChange={(e) => handleFieldChange(spec.section, spec.field, e.target.value)}
                  className="w-full min-h-[42px] bg-zinc-950 border border-zinc-700 focus:border-purple-500 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Rules Editor */}
      {showRulesEditor && (
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-purple-300">
            Código de Conducta (4 Reglas en Info & Reglas)
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {state.texts.info.rules.map((rule, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-zinc-950/90 border border-white/10 space-y-2">
                <input
                  type="text"
                  value={rule.title}
                  onChange={(e) => handleRuleChange(idx, 'title', e.target.value)}
                  placeholder={`Título Regla ${idx + 1}`}
                  className="w-full min-h-[40px] bg-black/70 border border-zinc-700 focus:border-purple-500 rounded-lg px-3 py-1.5 text-sm font-semibold text-white focus:outline-none"
                />
                <textarea
                  rows={2}
                  value={rule.desc}
                  onChange={(e) => handleRuleChange(idx, 'desc', e.target.value)}
                  placeholder={`Descripción Regla ${idx + 1}`}
                  className="w-full bg-black/70 border border-zinc-700 focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map Effectiveness Editor */}
      {showMapsEditor && (
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-purple-300">
            Textos y Métricas de Efectividad por Mapa (Sección Estadísticas)
          </h5>
          <div className="space-y-2.5">
            {state.texts.stats.mapStats.map((mapItem, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-zinc-950/90 border border-white/10"
              >
                <input
                  type="text"
                  value={mapItem.name}
                  onChange={(e) => handleMapStatChange(idx, 'name', e.target.value)}
                  placeholder="Nombre del Mapa"
                  className="sm:col-span-2 min-h-[40px] bg-black/70 border border-zinc-700 rounded-lg px-3 text-sm text-white focus:outline-none"
                />
                <input
                  type="text"
                  value={mapItem.bestScore}
                  onChange={(e) => handleMapStatChange(idx, 'bestScore', e.target.value)}
                  placeholder="Mejor marcador"
                  className="min-h-[40px] bg-black/70 border border-zinc-700 rounded-lg px-3 text-sm text-zinc-200 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={mapItem.winRate}
                    onChange={(e) => handleMapStatChange(idx, 'winRate', e.target.value)}
                    title="% Win"
                    className="min-h-[40px] bg-black/70 border border-zinc-700 rounded-lg px-2.5 text-sm text-purple-300 font-mono-numbers focus:outline-none"
                  />
                  <input
                    type="number"
                    value={mapItem.played}
                    onChange={(e) => handleMapStatChange(idx, 'played', e.target.value)}
                    title="Partidas"
                    className="min-h-[40px] bg-black/70 border border-zinc-700 rounded-lg px-2.5 text-sm text-zinc-200 font-mono-numbers focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

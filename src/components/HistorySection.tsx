import React, { useState } from 'react';
import { Edit3, ExternalLink, Plus, Trash2, Trophy } from 'lucide-react';
import { useClanData } from '../context/ClanDataContext';
import { HistoryMatch, MatchOutcome } from '../types/clan';
import { launchVictoryBurst, playTapSound } from '../utils/soundAndEffects';
import { SmartImage } from './SmartImage';
import { EditableText, EditableValue } from './EditableText';

interface HistorySectionProps {
  onAddHistoryMatch: () => void;
  onEditHistoryMatch: (match: HistoryMatch) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  onAddHistoryMatch,
  onEditHistoryMatch,
}) => {
  const { state, stats, isAdmin, deleteHistoryMatch } = useClanData();
  const [outcomeFilter, setOutcomeFilter] = useState<'all' | MatchOutcome>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');

  const r = state.texts.record;

  const filteredMatches = state.history.filter((match) => {
    if (outcomeFilter !== 'all' && match.outcome !== outcomeFilter) return false;
    if (modeFilter !== 'all' && !match.modality.toLowerCase().includes(modeFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const uniqueModes = Array.from(
    new Set(state.history.map((m) => m.modality.trim()).filter(Boolean))
  );

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 font-heading mb-1">
            <Trophy className="w-4 h-4" />
            <EditableText section="record" field="kicker" label="Kicker Récord" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading">
            <EditableText section="record" field="title" label="Título Récord" />
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            <EditableText section="record" field="subtitle" label="Subtítulo Récord" multiline />
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              onAddHistoryMatch();
              playTapSound();
            }}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors self-start sm:self-auto shadow-md shadow-purple-950/40"
          >
            <Plus className="w-4 h-4" />
            <EditableText section="record" field="addBtn" label="Botón Registrar Partido" />
          </button>
        )}
      </div>

      {/* 5-Card KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        <div className="bg-[#10121b] border border-white/10 rounded-2xl p-4 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-heading">
            <EditableText section="record" field="cardPlayedTitle" label="Título Partidos Jugados" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono-numbers mt-1">
            {stats.totalMatches}
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            <EditableText section="record" field="cardPlayedSub" label="Subtítulo Partidos Jugados" />
          </div>
        </div>

        <button
          type="button"
          onClick={launchVictoryBurst}
          title="Haz clic para celebrar victorias"
          className="bg-emerald-950/25 border border-emerald-500/35 hover:border-emerald-400 rounded-2xl p-4 text-center cursor-pointer transition-colors"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-heading">
            <EditableText section="record" field="cardWinsTitle" label="Título Victorias" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono-numbers mt-1">
            {stats.wins}
          </div>
          <div className="text-xs text-emerald-300/80 mt-1">
            <EditableText section="record" field="cardWinsSub" label="Subtítulo Victorias" />
          </div>
        </button>

        <div className="bg-purple-950/25 border border-purple-500/30 rounded-2xl p-4 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-300 font-heading">
            <EditableText section="record" field="cardDrawsTitle" label="Título Empates" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-purple-300 font-mono-numbers mt-1">
            {stats.draws}
          </div>
          <div className="text-xs text-purple-300/80 mt-1">
            <EditableText section="record" field="cardDrawsSub" label="Subtítulo Empates" />
          </div>
        </div>

        <div className="bg-rose-950/25 border border-rose-500/30 rounded-2xl p-4 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 font-heading">
            <EditableText section="record" field="cardLossesTitle" label="Título Derrotas" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-rose-400 font-mono-numbers mt-1">
            {stats.losses}
          </div>
          <div className="text-xs text-rose-300/80 mt-1">
            <EditableText section="record" field="cardLossesSub" label="Subtítulo Derrotas" />
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-purple-950/50 via-[#10121b] to-black border border-purple-500/40 rounded-2xl p-4 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-300 font-heading">
            <EditableText section="record" field="cardWinRateTitle" label="Título Win Rate" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-purple-300 font-mono-numbers mt-1">
            {stats.winRate}%
          </div>
          <div className="text-xs text-zinc-300 mt-1">
            <EditableText section="record" field="cardWinRateSub" label="Subtítulo Win Rate" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex p-1 bg-zinc-900 border border-white/10 rounded-xl overflow-x-auto no-scrollbar">
          {[
            { id: 'all', field: 'filterAll', label: 'Filtro Todos', count: state.history.length, activeCls: 'bg-purple-600 text-white' },
            { id: 'win', field: 'filterWins', label: 'Filtro Victorias', count: stats.wins, activeCls: 'bg-emerald-600 text-white' },
            { id: 'draw', field: 'filterDraws', label: 'Filtro Empates', count: stats.draws, activeCls: 'bg-purple-700 text-white' },
            { id: 'loss', field: 'filterLosses', label: 'Filtro Derrotas', count: stats.losses, activeCls: 'bg-rose-600 text-white' },
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => {
                setOutcomeFilter(btn.id as 'all' | MatchOutcome);
                playTapSound();
              }}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider whitespace-nowrap shrink-0 transition-colors ${
                outcomeFilter === btn.id ? `${btn.activeCls} font-bold` : 'text-zinc-400 hover:text-white'
              }`}
            >
              <EditableText
                section="record"
                field={btn.field}
                label={btn.label}
                suffix={` (${btn.count})`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <EditableText
            section="record"
            field="modeLabel"
            label="Etiqueta Modo"
            className="text-xs text-zinc-400 shrink-0"
          />
          <select
            value={modeFilter}
            onChange={(e) => {
              setModeFilter(e.target.value);
              playTapSound();
            }}
            className="min-h-[44px] w-full sm:w-auto bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
          >
            <option value="all">{r.allModesOption}</option>
            {uniqueModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Matches List */}
      {filteredMatches.length === 0 ? (
        <div className="bg-[#10121b] border border-white/10 rounded-3xl p-8 text-center">
          <Trophy className="w-10 h-10 text-purple-400 mx-auto mb-3" />
          <p className="text-sm text-zinc-300">
            <EditableText section="record" field="emptyTitle" label="Mensaje historial vacío" />
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((match) => {
            const isWin = match.outcome === 'win';
            const isLoss = match.outcome === 'loss';

            return (
              <article
                key={match.id}
                className={`bg-[#10121b] border rounded-2xl p-4 sm:p-5 transition-colors ${
                  isWin
                    ? 'border-emerald-500/25'
                    : isLoss
                    ? 'border-rose-500/25'
                    : 'border-purple-500/25'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Status & Date */}
                  <div className="flex items-center justify-between lg:justify-start gap-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-heading font-bold uppercase tracking-wider ${
                        isWin
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/35'
                          : isLoss
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/35'
                          : 'bg-purple-950/60 text-purple-300 border border-purple-500/35'
                      }`}
                    >
                      <EditableText
                        section="record"
                        field={isWin ? 'winBadge' : isLoss ? 'lossBadge' : 'drawBadge'}
                        label={isWin ? 'Etiqueta Victoria' : isLoss ? 'Etiqueta Derrota' : 'Etiqueta Empate'}
                      />
                    </span>
                    <span className="text-xs text-zinc-400 font-mono-numbers">{match.date}</span>
                  </div>

                  {/* Scoreboard */}
                  <div className="flex items-center justify-between sm:justify-center gap-3 sm:gap-6 flex-1 bg-black/35 lg:bg-transparent rounded-xl p-3 lg:p-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-black border border-purple-500/40 overflow-hidden shrink-0">
                        <SmartImage
                          src={state.info.logoUrl}
                          alt={state.info.name}
                          fallbackText={state.info.tag}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="font-heading font-bold text-sm text-white truncate">
                        {state.info.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono-numbers text-xl sm:text-2xl font-black shrink-0">
                      <span className={isWin ? 'text-emerald-400' : 'text-white'}>
                        {match.ourScore}
                      </span>
                      <span className="text-zinc-600 text-base">-</span>
                      <span className={isLoss ? 'text-rose-400' : 'text-zinc-300'}>
                        {match.opponentScore}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 min-w-0 justify-end">
                      <EditableValue
                        value={match.opponentName}
                        target={{
                          kind: 'historyMatch',
                          id: match.id,
                          field: 'opponentName',
                          label: 'Nombre del Rival',
                        }}
                        className="font-heading font-bold text-sm text-zinc-200 truncate text-right"
                      />
                      <div className="w-9 h-9 rounded-xl bg-black border border-white/15 overflow-hidden shrink-0">
                        <SmartImage
                          src={match.opponentLogo}
                          alt={match.opponentName}
                          fallbackText={match.opponentTag || match.opponentName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Details & Admin Actions */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 text-xs">
                    <div className="text-zinc-400 flex flex-wrap items-center gap-1.5">
                      <EditableValue
                        value={match.map}
                        target={{
                          kind: 'historyMatch',
                          id: match.id,
                          field: 'map',
                          label: 'Mapa del Partido',
                        }}
                        className="text-zinc-200 font-medium"
                      />
                      <span aria-hidden="true">·</span>
                      <EditableValue
                        value={match.modality}
                        target={{
                          kind: 'historyMatch',
                          id: match.id,
                          field: 'modality',
                          label: 'Modalidad del Partido',
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {match.vodLink && (
                        <a
                          href={match.vodLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[38px] px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-heading font-semibold uppercase flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                          <EditableText section="record" field="vodBtn" label="Botón Ver VOD" />
                        </a>
                      )}

                      {isAdmin && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              onEditHistoryMatch(match);
                              playTapSound();
                            }}
                            title="Editar Partido"
                            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-300 hover:text-purple-300"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`¿Eliminar el partido contra ${match.opponentName}?`)) {
                                deleteHistoryMatch(match.id);
                              }
                            }}
                            title="Eliminar Partido"
                            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-300 hover:bg-rose-500 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {(match.mvp || match.notes) && (
                  <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-400">
                    {match.mvp && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <strong className="text-purple-300">
                          <EditableText section="record" field="mvpLabel" label="Etiqueta MVP" />
                        </strong>
                        <EditableValue
                          value={match.mvp}
                          target={{
                            kind: 'historyMatch',
                            id: match.id,
                            field: 'mvp',
                            label: 'MVP del Partido',
                          }}
                          className="text-zinc-200"
                        />
                        {match.ticketsDifference && (
                          <>
                            <span className="text-zinc-600">·</span>
                            <EditableValue
                              value={match.ticketsDifference}
                              target={{
                                kind: 'historyMatch',
                                id: match.id,
                                field: 'ticketsDifference',
                                label: 'Diferencia / Detalle',
                              }}
                              className="text-zinc-500"
                            />
                          </>
                        )}
                      </div>
                    )}
                    {match.notes && (
                      <EditableValue
                        value={match.notes}
                        target={{
                          kind: 'historyMatch',
                          id: match.id,
                          field: 'notes',
                          label: 'Notas del Partido',
                          multiline: true,
                        }}
                        className="text-zinc-400"
                      />
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit3,
  ExternalLink,
  Globe,
  MapPin,
  Plus,
  Trash2,
} from 'lucide-react';
import { useClanData } from '../context/ClanDataContext';
import { UpcomingMatch } from '../types/clan';
import { formatMatchTime, getWorldMatchTimes, TIMEZONE_OPTIONS } from '../utils/timezones';
import { playTapSound } from '../utils/soundAndEffects';
import { SmartImage } from './SmartImage';
import { EditableText, EditableValue } from './EditableText';

interface CalendarSectionProps {
  onAddNewMatch: () => void;
  onEditMatch: (match: UpcomingMatch) => void;
  onRecordResult: (match: UpcomingMatch) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  onAddNewMatch,
  onEditMatch,
  onRecordResult,
}) => {
  const { state, isAdmin, selectedTimezone, setSelectedTimezone, deleteUpcomingMatch } = useClanData();
  const [expandedId, setExpandedId] = useState<string | null>(
    state.upcomingMatches[0]?.id ?? null
  );
  const activeTzObj = TIMEZONE_OPTIONS.find((t) => t.tz === selectedTimezone);

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 font-heading mb-1">
            <Calendar className="w-4 h-4" />
            <EditableText section="calendar" field="kicker" label="Kicker Calendario" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading">
            <EditableText section="calendar" field="title" label="Título Calendario" />
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            <EditableText section="calendar" field="subtitle" label="Subtítulo Calendario" multiline />
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              onAddNewMatch();
              playTapSound();
            }}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors self-start sm:self-auto shadow-md shadow-purple-950/40"
          >
            <Plus className="w-4 h-4" />
            <EditableText section="calendar" field="addBtn" label="Botón Agendar Versus" />
          </button>
        )}
      </div>

      {/* Timezone Selector Bar */}
      <div className="mb-6 bg-[#10121b] border border-white/10 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300">
          <Globe className="w-4 h-4 text-purple-400 shrink-0" />
          <EditableText section="calendar" field="timezoneNote" label="Texto zona horaria" />
          <span className="font-semibold text-white">
            {activeTzObj ? `${activeTzObj.flag} ${activeTzObj.country}` : selectedTimezone}
          </span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {TIMEZONE_OPTIONS.map((tz) => {
            const active = tz.tz === selectedTimezone;
            return (
              <button
                key={tz.code}
                type="button"
                onClick={() => {
                  setSelectedTimezone(tz.tz);
                  playTapSound();
                }}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 border transition-colors ${
                  active
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-black/40 text-zinc-300 border-white/10 hover:text-white'
                }`}
              >
                {tz.flag} {tz.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Match List */}
      {state.upcomingMatches.length === 0 ? (
        <div className="bg-[#10121b] border border-white/10 rounded-3xl p-8 text-center">
          <Calendar className="w-10 h-10 text-purple-400 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-white uppercase">
            <EditableText section="calendar" field="emptyTitle" label="Título calendario vacío" />
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            <EditableText section="calendar" field="emptyDesc" label="Descripción calendario vacío" multiline />
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {state.upcomingMatches.map((match) => {
            const isExpanded = expandedId === match.id;
            const localInfo = formatMatchTime(match.matchDate, selectedTimezone);
            const worldTimes = getWorldMatchTimes(match.matchDate);

            return (
              <article
                key={match.id}
                className="bg-[#10121b] border border-white/10 hover:border-purple-500/40 rounded-2xl overflow-hidden transition-colors"
              >
                <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Teams & Metadata */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-black border border-rose-500/40 p-1.5 shrink-0 overflow-hidden">
                      <SmartImage
                        src={match.opponentLogo}
                        alt={match.opponentName}
                        fallbackText={match.opponentTag || match.opponentName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-purple-400 font-heading uppercase tracking-wide">
                        <EditableValue
                          value={match.tournamentName || 'Versus Oficial'}
                          target={{
                            kind: 'upcomingMatch',
                            id: match.id,
                            field: 'tournamentName',
                            label: 'Torneo del Versus',
                          }}
                        />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold uppercase text-white font-heading mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span>{state.info.tag} vs</span>
                        <EditableValue
                          value={match.opponentName}
                          target={{
                            kind: 'upcomingMatch',
                            id: match.id,
                            field: 'opponentName',
                            label: 'Nombre del Rival',
                          }}
                        />
                        <EditableValue
                          value={match.opponentTag}
                          target={{
                            kind: 'upcomingMatch',
                            id: match.id,
                            field: 'opponentTag',
                            label: 'Tag del Rival',
                          }}
                          className="text-rose-400 font-mono-numbers text-sm"
                        />
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
                        <EditableValue
                          value={match.modality}
                          target={{
                            kind: 'upcomingMatch',
                            id: match.id,
                            field: 'modality',
                            label: 'Modalidad',
                          }}
                        />
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 text-zinc-300">
                          <MapPin className="w-3 h-3 text-purple-400" />
                          <EditableValue
                            value={match.map}
                            target={{
                              kind: 'upcomingMatch',
                              id: match.id,
                              field: 'map',
                              label: 'Mapa',
                            }}
                          />
                        </span>
                        <span aria-hidden="true">·</span>
                        <EditableValue
                          value={match.serverRegion}
                          target={{
                            kind: 'upcomingMatch',
                            id: match.id,
                            field: 'serverRegion',
                            label: 'Región Servidor',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: Date + Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/10">
                    <div className="sm:text-right">
                      <div className="text-sm font-bold text-purple-300 font-mono-numbers flex items-center gap-1.5 sm:justify-end">
                        <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        {localInfo.formattedTime}
                      </div>
                      <div className="text-xs text-zinc-400 capitalize">{localInfo.formattedDate}</div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {match.streamUrl && (
                        <a
                          href={match.streamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[40px] px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-heading font-semibold uppercase flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                          <EditableText section="calendar" field="streamBtn" label="Botón Ir al Stream" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setExpandedId(isExpanded ? null : match.id);
                          playTapSound();
                        }}
                        className="min-h-[40px] px-3 py-1.5 rounded-xl bg-purple-950/50 border border-purple-500/35 text-purple-200 hover:bg-purple-900/60 text-xs font-heading font-semibold uppercase flex items-center gap-1.5"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <EditableText section="calendar" field="collapseTimesBtn" label="Botón ocultar horarios" />
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            <EditableText section="calendar" field="expandTimesBtn" label="Botón ver horas por país" />
                          </>
                        )}
                      </button>

                      {isAdmin && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              onRecordResult(match);
                              playTapSound();
                            }}
                            title="Finalizar y Registrar en Récord"
                            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onEditMatch(match);
                              playTapSound();
                            }}
                            title="Editar Versus"
                            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-300 hover:text-purple-300 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`¿Eliminar versus contra ${match.opponentName}?`)) {
                                deleteUpcomingMatch(match.id);
                              }
                            }}
                            title="Eliminar Versus"
                            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-zinc-800 text-zinc-300 hover:bg-rose-500 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-3 bg-black/40 border-t border-white/10">
                    <div className="text-xs font-bold uppercase tracking-wider text-purple-400 font-heading mb-2.5">
                      <EditableText section="calendar" field="worldTimesHeading" label="Encabezado horas por país" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                      {worldTimes.map((item) => (
                        <div
                          key={item.code}
                          className="bg-zinc-900/90 border border-white/10 rounded-xl p-2 text-center"
                        >
                          <div className="text-base">{item.flag}</div>
                          <div className="text-[11px] font-semibold text-zinc-300 truncate">
                            {item.country}
                          </div>
                          <div className="text-xs font-bold text-purple-300 font-mono-numbers mt-0.5">
                            {item.time}
                          </div>
                        </div>
                      ))}
                    </div>

                    {(match.notes || match.caster) && (
                      <div className="mt-3 space-y-1.5 text-xs text-zinc-300 bg-white/[0.04] p-3 rounded-xl">
                        {match.caster && (
                          <div>
                            <strong className="text-purple-300">
                              <EditableText section="calendar" field="casterPrefix" label="Prefijo Caster" />
                            </strong>{' '}
                            <EditableValue
                              value={match.caster}
                              target={{
                                kind: 'upcomingMatch',
                                id: match.id,
                                field: 'caster',
                                label: 'Caster del Versus',
                              }}
                            />
                          </div>
                        )}
                        {match.notes && (
                          <div>
                            <strong className="text-zinc-200">
                              <EditableText section="calendar" field="notesPrefix" label="Prefijo notas tácticas" />
                            </strong>{' '}
                            <EditableValue
                              value={match.notes}
                              target={{
                                kind: 'upcomingMatch',
                                id: match.id,
                                field: 'notes',
                                label: 'Notas tácticas',
                                multiline: true,
                              }}
                            />
                          </div>
                        )}
                      </div>
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

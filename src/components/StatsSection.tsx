import React from 'react';
import { Award, BarChart3, Crosshair, Shield, TrendingUp, Users } from 'lucide-react';
import { useClanData } from '../context/ClanDataContext';
import { SmartImage } from './SmartImage';
import { EditableText, EditableValue } from './EditableText';

export const StatsSection: React.FC = () => {
  const { state, stats } = useClanData();
  const s = state.texts.stats;
  const topKd = [...state.roster].sort((a, b) => b.kdRatio - a.kdRatio).slice(0, 5);

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 font-heading mb-1">
          <BarChart3 className="w-4 h-4" />
          <EditableText section="stats" field="kicker" label="Kicker Estadísticas" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading">
          <EditableText section="stats" field="title" label="Título Estadísticas" />
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          <EditableText section="stats" field="subtitle" label="Subtítulo Estadísticas" multiline />
        </p>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-8">
        <div className="bg-[#10121b] border border-purple-500/30 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-heading">
              <EditableText section="stats" field="winRateCardTitle" label="Título Tarjeta Win Rate" />
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-4xl font-black text-white font-mono-numbers">{stats.winRate}%</div>
          <p className="text-xs text-zinc-400 mt-2">
            <EditableText section="stats" field="winRateCardDescPrefix" label="Prefijo Win Rate" />{' '}
            {stats.totalMatches}{' '}
            <EditableText section="stats" field="winRateCardDescSuffix" label="Sufijo Win Rate" />
          </p>
          <div className="w-full bg-zinc-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${stats.winRate}%` }}
            />
          </div>
        </div>

        <div className="bg-[#10121b] border border-white/10 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-heading">
              <EditableText section="stats" field="avgKdCardTitle" label="Título Tarjeta K/D" />
            </span>
            <Crosshair className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-4xl font-black text-purple-300 font-mono-numbers">{stats.avgKd}</div>
          <p className="text-xs text-zinc-400 mt-2">
            <EditableText section="stats" field="avgKdCardDesc" label="Descripción Tarjeta K/D" multiline />
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
            <EditableText section="stats" field="avgKdRangeLabel" label="Rango K/D" />
            <span className="text-purple-300 font-semibold">
              <EditableText section="stats" field="avgKdTierLabel" label="Etiqueta Tier" />
            </span>
          </div>
        </div>

        <div className="bg-[#10121b] border border-white/10 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-heading">
              <EditableText section="stats" field="tournamentsCardTitle" label="Título Tarjeta Trofeos" />
            </span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-4xl font-black text-white font-mono-numbers">
            <EditableText section="stats" field="tournamentsCardCount" label="Número de Trofeos" />
          </div>
          <p className="text-xs text-zinc-400 mt-2">
            <EditableText
              section="stats"
              field="tournamentsCardDesc"
              label="Descripción Tarjeta Trofeos"
              multiline
            />
          </p>
          <div className="mt-3 text-xs text-purple-300 font-medium">
            <EditableText section="stats" field="tournamentsHighlight" label="Logro destacado" />
          </div>
        </div>
      </div>

      {/* Leaders & Map Effectiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#10121b] border border-white/10 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-white/10">
            <h3 className="font-heading font-bold text-base uppercase text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <EditableText section="stats" field="kdLeadersTitle" label="Título Líderes K/D" />
            </h3>
            <span className="text-xs text-zinc-400">
              <EditableText section="stats" field="kdLeadersSub" label="Subtítulo Líderes K/D" />
            </span>
          </div>

          <div className="space-y-2.5">
            {topKd.map((member, index) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-black/40 border border-white/10"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-6 text-center font-heading font-bold text-sm shrink-0 ${
                      index === 0
                        ? 'text-purple-400'
                        : index === 1
                        ? 'text-zinc-300'
                        : 'text-zinc-500'
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-purple-500/35 shrink-0">
                    <SmartImage
                      src={member.avatarUrl}
                      alt={member.gamertag}
                      fallbackText={member.gamertag}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-heading font-bold text-sm text-white truncate">
                      <EditableValue
                        value={member.gamertag}
                        target={{
                          kind: 'rosterMember',
                          id: member.id,
                          field: 'gamertag',
                          label: 'Gamertag',
                        }}
                      />
                    </div>
                    <div className="text-xs text-zinc-400 truncate">
                      <EditableValue
                        value={member.role}
                        target={{
                          kind: 'rosterMember',
                          id: member.id,
                          field: 'role',
                          label: 'Rol',
                        }}
                      />{' '}
                      ·{' '}
                      <EditableValue
                        value={member.favoriteOperator}
                        target={{
                          kind: 'rosterMember',
                          id: member.id,
                          field: 'favoriteOperator',
                          label: 'Operador Favorito',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-purple-300 font-mono-numbers">
                    {member.kdRatio.toFixed(2)} K/D
                  </div>
                  <div className="text-xs text-emerald-400 font-mono-numbers">
                    {member.winRate}% Win
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#10121b] border border-white/10 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-white/10">
            <h3 className="font-heading font-bold text-base uppercase text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <EditableText section="stats" field="mapsTitle" label="Título Efectividad por Mapa" />
            </h3>
            <span className="text-xs text-zinc-400">
              <EditableText section="stats" field="mapsSub" label="Subtítulo Mapas" />
            </span>
          </div>

          <div className="space-y-4">
            {s.mapStats.map((mapItem, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5 gap-2">
                  <EditableValue
                    value={mapItem.name}
                    target={{
                      kind: 'mapStat',
                      index: idx,
                      key: 'name',
                      label: `Nombre Mapa ${idx + 1}`,
                    }}
                    className="font-semibold text-zinc-200"
                  />
                  <span className="text-purple-300 font-mono-numbers font-bold shrink-0">
                    {mapItem.winRate}% ({mapItem.played} PJ)
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-700 to-purple-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, mapItem.winRate))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1 gap-2">
                  <span>
                    <EditableText section="stats" field="bestScorePrefix" label="Prefijo mejor marcador" />{' '}
                    <EditableValue
                      value={mapItem.bestScore}
                      target={{
                        kind: 'mapStat',
                        index: idx,
                        key: 'bestScore',
                        label: `Mejor marcador (${mapItem.name})`,
                      }}
                    />
                  </span>
                  <EditableText
                    section="stats"
                    field={mapItem.winRate >= 80 ? 'mapFortressLabel' : 'mapCompetitiveLabel'}
                    label={mapItem.winRate >= 80 ? 'Etiqueta Fortaleza' : 'Etiqueta Mapa Competitivo'}
                    className="text-purple-400 font-semibold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

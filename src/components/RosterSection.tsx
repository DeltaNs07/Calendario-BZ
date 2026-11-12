import React, { useState } from 'react';
import {
  Award,
  Crosshair,
  Edit3,
  Image as ImageIcon,
  Plus,
  Star,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import { useClanData } from '../context/ClanDataContext';
import { RosterMember } from '../types/clan';
import { playTapSound } from '../utils/soundAndEffects';
import { SmartImage } from './SmartImage';
import { EditableText, EditableValue } from './EditableText';

interface RosterSectionProps {
  onAddMember: () => void;
  onEditMember: (member: RosterMember) => void;
}

const ROLE_OPTIONS = [
  'Líder / IGL',
  'Co-Líder',
  'Asalto / Fragger',
  'Recon / Sniper',
  'Support / Médico',
  'Ingeniero / Tanquista',
  'Suplente / Reserva',
];

export const RosterSection: React.FC<RosterSectionProps> = ({
  onAddMember,
  onEditMember,
}) => {
  const { state, isAdmin, updateRosterMember, deleteRosterMember } = useClanData();
  const [statusFilter, setStatusFilter] = useState<'all' | 'starters' | 'subs'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const r = state.texts.roster;

  const filteredRoster = state.roster.filter((member) => {
    if (statusFilter === 'starters' && !member.isStarter) return false;
    if (statusFilter === 'subs' && member.isStarter) return false;
    if (roleFilter !== 'all' && member.role !== roleFilter) return false;
    return true;
  });

  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 font-heading mb-1">
            <Users className="w-4 h-4" />
            <EditableText section="roster" field="kicker" label="Kicker Roster" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white font-heading">
            <EditableText section="roster" field="title" label="Título Roster" />
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            <EditableText section="roster" field="subtitle" label="Subtítulo Roster" multiline />
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              onAddMember();
              playTapSound();
            }}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors self-start sm:self-auto shadow-md shadow-purple-950/40"
          >
            <Plus className="w-4 h-4" />
            <EditableText section="roster" field="addBtn" label="Botón Añadir Jugador" />
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="inline-flex p-1 bg-zinc-900 border border-white/10 rounded-xl w-full sm:w-auto">
          {[
            {
              id: 'all',
              field: 'filterAll',
              label: 'Filtro Todos',
              count: state.roster.length,
            },
            {
              id: 'starters',
              field: 'filterStarters',
              label: 'Filtro Titulares',
              count: state.roster.filter((m) => m.isStarter).length,
            },
            {
              id: 'subs',
              field: 'filterSubs',
              label: 'Filtro Reservas',
              count: state.roster.filter((m) => !m.isStarter).length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusFilter(tab.id as 'all' | 'starters' | 'subs');
                playTapSound();
              }}
              className={`flex-1 sm:flex-initial min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === tab.id
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <EditableText
                section="roster"
                field={tab.field}
                label={tab.label}
                suffix={` (${tab.count})`}
              />
            </button>
          ))}
        </div>

        <select
          aria-label="Filtrar por rol"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            playTapSound();
          }}
          className="min-h-[44px] bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
        >
          <option value="all">{r.allRolesOption}</option>
          {ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Cards Grid */}
      {filteredRoster.length === 0 ? (
        <div className="bg-[#10121b] border border-white/10 rounded-3xl p-8 text-center">
          <Users className="w-10 h-10 text-purple-400 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-lg text-white uppercase">
            <EditableText section="roster" field="emptyTitle" label="Título filtro vacío" />
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            <EditableText section="roster" field="emptyDesc" label="Descripción filtro vacío" multiline />
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredRoster.map((member) => (
            <article
              key={member.id}
              className={`bg-[#10121b] border rounded-2xl overflow-hidden transition-colors flex flex-col justify-between ${
                member.isStarter
                  ? 'border-purple-500/35 hover:border-purple-400/70'
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              <div>
                <div className="relative h-24 bg-gradient-to-t from-[#10121b] via-zinc-900/90 to-purple-950/35 p-4 flex items-end">
                  <div className="absolute top-3 right-3 text-xs font-semibold uppercase tracking-wider font-heading">
                    {member.isStarter ? (
                      <span className="inline-flex items-center gap-1 text-purple-300">
                        <Star className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                        <EditableText section="roster" field="starterBadge" label="Etiqueta Titular" />
                      </span>
                    ) : (
                      <EditableText
                        section="roster"
                        field="subBadge"
                        label="Etiqueta Reserva"
                        className="text-zinc-400"
                      />
                    )}
                  </div>

                  <div className="relative -mb-6 w-16 h-16 rounded-2xl border-2 border-purple-500/50 bg-black overflow-hidden shadow-lg">
                    <SmartImage
                      src={member.avatarUrl}
                      alt={member.gamertag}
                      fallbackText={member.gamertag}
                      className="w-full h-full object-cover"
                    />
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          onEditMember(member);
                          playTapSound();
                        }}
                        className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 focus-visible:opacity-100 flex items-center justify-center transition-opacity text-purple-200"
                        title="Cambiar Foto"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-8 px-4 pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold uppercase tracking-wide text-white font-heading truncate">
                      <EditableValue
                        value={member.gamertag}
                        target={{
                          kind: 'rosterMember',
                          id: member.id,
                          field: 'gamertag',
                          label: 'Gamertag del Jugador',
                        }}
                      />
                    </h3>
                    <EditableValue
                      value={member.country}
                      target={{
                        kind: 'rosterMember',
                        id: member.id,
                        field: 'country',
                        label: 'País del Jugador',
                      }}
                      className="text-xs text-zinc-400 shrink-0"
                    />
                  </div>
                  {(member.realName || isAdmin) && (
                    <div className="text-xs text-zinc-400 truncate mt-0.5">
                      <EditableValue
                        value={member.realName || ''}
                        placeholder="Añadir nombre..."
                        target={{
                          kind: 'rosterMember',
                          id: member.id,
                          field: 'realName',
                          label: 'Nombre Real / Alias',
                        }}
                      />
                    </div>
                  )}

                  <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-purple-400 font-heading">
                    <EditableValue
                      value={member.role}
                      target={{
                        kind: 'rosterMember',
                        id: member.id,
                        field: 'role',
                        label: 'Rol del Jugador',
                      }}
                    />
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-300">
                    <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <EditableValue
                      value={member.rank}
                      target={{
                        kind: 'rosterMember',
                        id: member.id,
                        field: 'rank',
                        label: 'Rango del Jugador',
                      }}
                      className="truncate"
                    />
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-white/10 space-y-1.5 text-xs text-zinc-400">
                    <div className="flex items-center justify-between gap-2">
                      <EditableText section="roster" field="operatorLabel" label="Etiqueta Operador" suffix=":" />
                      <EditableValue
                        value={member.favoriteOperator}
                        target={{
                          kind: 'rosterMember',
                          id: member.id,
                          field: 'favoriteOperator',
                          label: 'Operador Favorito',
                        }}
                        className="text-zinc-200 font-medium truncate text-right"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1">
                        <Crosshair className="w-3 h-3 text-zinc-400" />
                        <EditableText section="roster" field="weaponLabel" label="Etiqueta Arma" suffix=":" />
                      </span>
                      <EditableValue
                        value={member.favoriteWeapon}
                        target={{
                          kind: 'rosterMember',
                          id: member.id,
                          field: 'favoriteWeapon',
                          label: 'Arma Principal',
                        }}
                        className="text-zinc-200 font-medium truncate text-right"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 bg-black/45 border border-white/10 rounded-xl p-2.5 text-center">
                    <div>
                      <div className="text-[11px] text-zinc-400 uppercase">
                        <EditableText section="roster" field="kdLabel" label="Etiqueta K/D" />
                      </div>
                      <div className="text-sm font-bold text-purple-300 font-mono-numbers">
                        {member.kdRatio.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-zinc-400 uppercase">
                        <EditableText section="roster" field="matchesLabel" label="Etiqueta Partidas" />
                      </div>
                      <div className="text-sm font-bold text-zinc-100 font-mono-numbers">
                        {member.matchesPlayed}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-zinc-400 uppercase">
                        <EditableText section="roster" field="winRateLabel" label="Etiqueta Win %" />
                      </div>
                      <div className="text-sm font-bold text-emerald-400 font-mono-numbers">
                        {member.winRate}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="px-4 py-2.5 bg-black/45 border-t border-white/10 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      updateRosterMember(member.id, { isStarter: !member.isStarter });
                    }}
                    className="min-h-[38px] text-zinc-300 hover:text-purple-300 flex items-center gap-1.5 font-medium"
                  >
                    <UserCheck
                      className={`w-3.5 h-3.5 ${
                        member.isStarter ? 'text-purple-400' : 'text-zinc-500'
                      }`}
                    />
                    <EditableText
                      section="roster"
                      field={member.isStarter ? 'makeSubBtn' : 'makeStarterBtn'}
                      label={member.isStarter ? 'Botón Hacer Reserva' : 'Botón Hacer Titular'}
                    />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        onEditMember(member);
                        playTapSound();
                      }}
                      title="Editar Operador y Foto"
                      className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg text-zinc-300 hover:text-purple-300 hover:bg-white/5"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`¿Eliminar a ${member.gamertag} del roster?`)) {
                          deleteRosterMember(member.id);
                        }
                      }}
                      title="Eliminar Operador"
                      className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg text-zinc-300 hover:text-rose-400 hover:bg-white/5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

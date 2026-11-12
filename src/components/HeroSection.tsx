import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Edit3,
  ExternalLink,
  Image as ImageIcon,
  MapPin,
  Megaphone,
  Shield,
  Swords,
  Users,
} from 'lucide-react';
import { useClanData } from '../context/ClanDataContext';
import { formatMatchTime, getCountdown, getWorldMatchTimes } from '../utils/timezones';
import { playTapSound } from '../utils/soundAndEffects';
import { SmartImage } from './SmartImage';
import { EditableText, EditableValue } from './EditableText';
import { resolveAssetUrl } from '../data/defaultClanData';

interface HeroSectionProps {
  onEditNextMatch: () => void;
  onEditLogos: () => void;
  onNavigateToCalendar: () => void;
  onNavigateToRoster: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onEditNextMatch,
  onEditLogos,
  onNavigateToCalendar,
  onNavigateToRoster,
}) => {
  const { state, isAdmin, selectedTimezone } = useClanData();
  const nextMatch = state.upcomingMatches[0];
  const h = state.texts.hero;

  const [countdown, setCountdown] = useState(() =>
    nextMatch ? getCountdown(nextMatch.matchDate) : null
  );

  useEffect(() => {
    if (!nextMatch) {
      setCountdown(null);
      return;
    }
    setCountdown(getCountdown(nextMatch.matchDate));
    const timer = setInterval(() => {
      setCountdown(getCountdown(nextMatch.matchDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [nextMatch?.matchDate]);

  const worldTimes = nextMatch ? getWorldMatchTimes(nextMatch.matchDate) : [];
  const localFormatted = nextMatch ? formatMatchTime(nextMatch.matchDate, selectedTimezone) : null;
  const resolvedBannerUrl = resolveAssetUrl(state.info.bannerUrl);
  const captain = state.roster[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#130a22] via-[#090a10] to-[#07080c] border-b border-white/10 pt-5 pb-10 sm:pt-8 sm:pb-14 px-4 sm:px-6 lg:px-8">
      {/* Background Banner */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: `url(${resolvedBannerUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-black/55 to-black/75 pointer-events-none" />
      <div className="absolute inset-0 tactical-grid pointer-events-none opacity-45" />

      <div className="relative max-w-7xl mx-auto">
        {/* Announcement Strip */}
        {state.info.announcement && (
          <div className="mb-5 max-w-4xl mx-auto bg-purple-950/45 border border-purple-500/35 rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm text-purple-100 backdrop-blur-sm">
            <div className="flex items-start sm:items-center gap-2.5 min-w-0">
              <span className="font-bold uppercase tracking-wider text-purple-300 font-heading shrink-0 flex items-center gap-1.5 pt-0.5 sm:pt-0">
                <Megaphone className="w-4 h-4 text-purple-400 shrink-0" />
                <EditableText section="hero" field="announcementBadge" label="Etiqueta Comunicado" />
              </span>
              <EditableValue
                value={state.info.announcement}
                target={{
                  kind: 'clanInfo',
                  field: 'announcement',
                  label: 'Comunicado Superior',
                  multiline: true,
                }}
                className="text-zinc-200 leading-snug"
              />
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  onEditNextMatch();
                  playTapSound();
                }}
                className="shrink-0 min-h-[36px] px-2.5 rounded-lg bg-purple-900/50 text-purple-200 hover:text-white text-xs font-heading font-semibold uppercase"
              >
                Editar
              </button>
            )}
          </div>
        )}

        {/* Clan Headline */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-wider text-purple-400 font-heading mb-2">
            <EditableValue
              value={state.info.game}
              target={{ kind: 'clanInfo', field: 'game', label: 'Juego Principal' }}
            />
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <EditableText section="hero" field="kickerSub" label="Sub-etiqueta Hero" />
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <EditableValue
              value={state.info.tag}
              target={{ kind: 'clanInfo', field: 'tag', label: 'Tag Oficial del Clan' }}
              className="text-zinc-300 font-mono-numbers"
            />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white font-heading [text-wrap:balance]">
            <EditableValue
              value={state.info.name}
              target={{ kind: 'clanInfo', field: 'name', label: 'Nombre Principal del Clan' }}
            />
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            <EditableValue
              value={state.info.motto}
              target={{ kind: 'clanInfo', field: 'motto', label: 'Lema de Batalla', multiline: true }}
              prefix="“"
              suffix="”"
            />
          </p>
        </div>

        {/* Main Versus Card */}
        {nextMatch ? (
          <div className="max-w-5xl mx-auto bg-[#0e1018]/95 border border-purple-500/30 rounded-3xl p-4 sm:p-7 backdrop-blur-xl shadow-2xl shadow-black/80 tactical-corner-tl">
            {/* Top Match Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10 text-xs text-zinc-300">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <Swords className="w-4 h-4 text-purple-400 shrink-0" />
                <EditableValue
                  value={nextMatch.tournamentName || 'Enfrentamiento de Clanes'}
                  target={{
                    kind: 'upcomingMatch',
                    id: nextMatch.id,
                    field: 'tournamentName',
                    label: 'Torneo / Liga del Versus',
                  }}
                  className="font-bold uppercase tracking-wider text-purple-300 font-heading"
                />
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <EditableValue
                  value={nextMatch.modality}
                  target={{
                    kind: 'upcomingMatch',
                    id: nextMatch.id,
                    field: 'modality',
                    label: 'Modalidad del Versus',
                  }}
                  className="text-zinc-300"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
                <span className="flex items-center gap-1.5 text-zinc-300 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <EditableValue
                    value={nextMatch.map}
                    target={{
                      kind: 'upcomingMatch',
                      id: nextMatch.id,
                      field: 'map',
                      label: 'Mapa del Versus',
                    }}
                  />
                </span>

                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onEditLogos();
                        playTapSound();
                      }}
                      className="min-h-[36px] flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-white/10 font-semibold uppercase tracking-wider text-xs transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                      Logos
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onEditNextMatch();
                        playTapSound();
                      }}
                      className="min-h-[36px] flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/80 text-purple-200 border border-purple-500/40 hover:bg-purple-600 hover:text-white font-semibold uppercase tracking-wider text-xs transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Editar Versus
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Faceoff: Side-by-side compact on Android, 11-col on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-11 gap-5 items-center">
              {/* Mobile Faceoff Row */}
              <div className="grid grid-cols-11 items-center gap-2 md:hidden">
                <div className="col-span-5 flex flex-col items-center text-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-black border-2 border-purple-500/50 p-1.5 shadow-lg overflow-hidden">
                      <SmartImage
                        src={state.info.logoUrl}
                        alt={state.info.name}
                        fallbackText={state.info.tag}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          onEditLogos();
                          playTapSound();
                        }}
                        className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg"
                        aria-label="Cambiar Logo"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <h2 className="mt-2.5 text-sm font-bold uppercase text-white font-heading leading-tight">
                    <EditableValue
                      value={state.info.name}
                      target={{ kind: 'clanInfo', field: 'name', label: 'Nombre del Clan' }}
                    />
                  </h2>
                  <EditableValue
                    value={state.info.tag}
                    target={{ kind: 'clanInfo', field: 'tag', label: 'Tag del Clan' }}
                    className="text-[11px] text-purple-400 font-mono-numbers mt-0.5"
                  />
                </div>

                <div className="col-span-1 flex flex-col items-center justify-center">
                  <EditableText
                    section="hero"
                    field="vsBadge"
                    label="Texto central VS"
                    className="font-heading font-black text-lg text-purple-400"
                  />
                </div>

                <div className="col-span-5 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-black border-2 border-rose-500/40 p-1.5 shadow-lg overflow-hidden">
                    <SmartImage
                      src={nextMatch.opponentLogo}
                      alt={nextMatch.opponentName}
                      fallbackText={nextMatch.opponentTag || nextMatch.opponentName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h2 className="mt-2.5 text-sm font-bold uppercase text-white font-heading leading-tight">
                    <EditableValue
                      value={nextMatch.opponentName}
                      target={{
                        kind: 'upcomingMatch',
                        id: nextMatch.id,
                        field: 'opponentName',
                        label: 'Nombre del Rival',
                      }}
                    />
                  </h2>
                  <EditableValue
                    value={nextMatch.opponentTag}
                    target={{
                      kind: 'upcomingMatch',
                      id: nextMatch.id,
                      field: 'opponentTag',
                      label: 'Tag del Rival',
                    }}
                    className="text-[11px] text-rose-400 font-mono-numbers mt-0.5"
                  />
                </div>
              </div>

              {/* Desktop Left Team */}
              <div className="hidden md:flex md:col-span-4 flex-col items-end text-right group">
                <div className="relative">
                  <div className="w-28 h-28 rounded-2xl bg-black/80 border-2 border-purple-500/50 p-2 shadow-xl shadow-purple-950/40 flex items-center justify-center overflow-hidden mb-3 group-hover:border-purple-400 transition-colors">
                    <SmartImage
                      src={state.info.logoUrl}
                      alt={state.info.name}
                      fallbackText={state.info.tag}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        onEditLogos();
                        playTapSound();
                      }}
                      className="absolute -bottom-1 -right-1 p-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-transform hover:scale-105"
                      title="Cambiar Logo de BAZTARDOS"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <h2 className="text-2xl font-bold uppercase tracking-wide text-white font-heading">
                  <EditableValue
                    value={state.info.name}
                    target={{ kind: 'clanInfo', field: 'name', label: 'Nombre del Clan' }}
                  />
                </h2>
                <div className="text-xs text-purple-400 font-mono-numbers mt-0.5">
                  <EditableValue
                    value={state.info.tag}
                    target={{ kind: 'clanInfo', field: 'tag', label: 'Tag del Clan' }}
                  />{' '}
                  · <EditableText section="hero" field="localTeamLabel" label="Etiqueta Local" />
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  <EditableText section="hero" field="captainPrefix" label="Prefijo Capitán" />:{' '}
                  {captain ? (
                    <EditableValue
                      value={captain.gamertag}
                      target={{
                        kind: 'rosterMember',
                        id: captain.id,
                        field: 'gamertag',
                        label: 'Gamertag del Capitán',
                      }}
                    />
                  ) : (
                    'Comandante BZT'
                  )}
                </div>
              </div>

              {/* Center Countdown */}
              <div className="md:col-span-3 flex flex-col items-center justify-center text-center py-1">
                {countdown?.isLive ? (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-rose-600/25 border border-rose-500 text-rose-200 text-xs font-bold uppercase tracking-wider mb-3">
                    <EditableText section="hero" field="liveBadge" label="Aviso Match en Vivo" />
                  </div>
                ) : countdown?.isPast ? (
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs uppercase tracking-wider mb-3">
                    <EditableText section="hero" field="finishedBadge" label="Aviso Match Finalizado" />
                  </div>
                ) : (
                  <div className="text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <EditableText section="hero" field="countdownTitle" label="Título Cuenta Regresiva" />
                  </div>
                )}

                {!countdown?.isPast && (
                  <div className="grid grid-cols-4 gap-2 w-full max-w-xs mb-3">
                    {[
                      { val: countdown?.days ?? 0, field: 'daysLabel', label: h.daysLabel },
                      { val: countdown?.hours ?? 0, field: 'hoursLabel', label: h.hoursLabel },
                      { val: countdown?.minutes ?? 0, field: 'minutesLabel', label: h.minutesLabel },
                      { val: countdown?.seconds ?? 0, field: 'secondsLabel', label: h.secondsLabel },
                    ].map((unit) => (
                      <div
                        key={unit.field}
                        className="bg-black/75 border border-white/10 rounded-2xl py-2 px-1.5 text-center"
                      >
                        <div className="text-xl sm:text-2xl font-bold text-purple-300 font-mono-numbers">
                          {String(unit.val).padStart(2, '0')}
                        </div>
                        <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-heading mt-0.5">
                          <EditableText section="hero" field={unit.field} label={`Unidad ${unit.label}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-xs sm:text-sm text-zinc-200 font-medium">
                  {localFormatted?.fullString}
                </div>
                <EditableValue
                  value={nextMatch.serverRegion}
                  target={{
                    kind: 'upcomingMatch',
                    id: nextMatch.id,
                    field: 'serverRegion',
                    label: 'Región Servidor del Versus',
                  }}
                  className="text-[11px] text-zinc-400 mt-0.5"
                />
              </div>

              {/* Desktop Right Team */}
              <div className="hidden md:flex md:col-span-4 flex-col items-start text-left">
                <div className="w-28 h-28 rounded-2xl bg-black/80 border-2 border-rose-500/40 p-2 shadow-xl flex items-center justify-center overflow-hidden mb-3">
                  <SmartImage
                    src={nextMatch.opponentLogo}
                    alt={nextMatch.opponentName}
                    fallbackText={nextMatch.opponentTag || nextMatch.opponentName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold uppercase tracking-wide text-white font-heading">
                  <EditableValue
                    value={nextMatch.opponentName}
                    target={{
                      kind: 'upcomingMatch',
                      id: nextMatch.id,
                      field: 'opponentName',
                      label: 'Nombre del Rival',
                    }}
                  />
                </h2>
                <div className="text-xs text-rose-400 font-mono-numbers mt-0.5">
                  <EditableValue
                    value={nextMatch.opponentTag}
                    target={{
                      kind: 'upcomingMatch',
                      id: nextMatch.id,
                      field: 'opponentTag',
                      label: 'Tag del Rival',
                    }}
                  />{' '}
                  · <EditableText section="hero" field="visitorTeamLabel" label="Etiqueta Rival" />
                </div>
                {nextMatch.caster && (
                  <div className="text-xs text-zinc-400 mt-1">
                    Cast:{' '}
                    <EditableValue
                      value={nextMatch.caster}
                      target={{
                        kind: 'upcomingMatch',
                        id: nextMatch.id,
                        field: 'caster',
                        label: 'Caster del Versus',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* International Times Strip */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center justify-between">
                <EditableText section="hero" field="worldTimesTitle" label="Título Horarios Internacionales" />
                <span className="sm:hidden">
                  <EditableText
                    section="hero"
                    field="swipeHint"
                    label="Texto deslizar móvil"
                    className="text-[11px] text-zinc-500"
                  />
                </span>
              </div>
              <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
                {worldTimes.map((item) => (
                  <div
                    key={item.code}
                    className={`min-w-[104px] sm:min-w-0 snap-start rounded-xl px-2.5 py-2 text-center border ${
                      item.tz === selectedTimezone
                        ? 'bg-purple-950/50 border-purple-500/50'
                        : 'bg-black/45 border-white/10'
                    }`}
                  >
                    <div className="text-sm">{item.flag}</div>
                    <div className="text-[11px] text-zinc-300 font-medium truncate">{item.country}</div>
                    <div className="text-xs font-bold text-purple-300 font-mono-numbers mt-0.5">
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  onNavigateToCalendar();
                  playTapSound();
                }}
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-950/40"
              >
                <Calendar className="w-4 h-4" />
                <EditableText section="hero" field="ctaCalendar" label="Botón Ver Calendario" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigateToRoster();
                  playTapSound();
                }}
                className="min-h-[48px] px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-white/10 font-heading font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <EditableText section="hero" field="ctaRoster" label="Botón Ver Escuadrón" />
              </button>
              {nextMatch.streamUrl && (
                <a
                  href={nextMatch.streamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] px-5 py-2.5 rounded-xl bg-black/60 hover:bg-zinc-900 text-purple-300 border border-purple-500/35 font-heading font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <EditableText section="hero" field="ctaStream" label="Botón Ver Transmisión" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-[#0e1018]/90 border border-white/10 rounded-3xl p-8 text-center">
            <Shield className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <h2 className="font-heading font-bold text-xl text-white uppercase">
              <EditableText section="hero" field="emptyTitle" label="Título sin enfrentamientos" />
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              <EditableText section="hero" field="emptyDesc" label="Descripción sin enfrentamientos" multiline />
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

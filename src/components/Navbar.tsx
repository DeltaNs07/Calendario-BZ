import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  ChevronRight,
  Clock,
  Image as ImageIcon,
  Info,
  Lock,
  MoreHorizontal,
  Pencil,
  Shield,
  Swords,
  Trophy,
  Users,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useClanData } from '../context/ClanDataContext';
import { TabId } from '../types/clan';
import { TIMEZONE_OPTIONS } from '../utils/timezones';
import { isSoundEnabled, playTapSound, toggleSoundEnabled } from '../utils/soundAndEffects';
import { SmartImage } from './SmartImage';
import { EditableText, EditableValue } from './EditableText';

interface NavbarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  onOpenAdminAuth: () => void;
  onOpenAdminPanel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAdminAuth,
  onOpenAdminPanel,
}) => {
  const {
    state,
    isAdmin,
    isInlineTextEditMode,
    setIsInlineTextEditMode,
    selectedTimezone,
    setSelectedTimezone,
  } = useClanData();

  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const t = state.texts.nav;

  const navItems: { id: TabId; field: keyof typeof t; label: string; icon: React.ReactNode }[] = [
    { id: 'versus', field: 'tabVersus', label: t.tabVersus, icon: <Swords className="w-5 h-5" /> },
    { id: 'calendario', field: 'tabCalendario', label: t.tabCalendario, icon: <Calendar className="w-5 h-5" /> },
    { id: 'roster', field: 'tabRoster', label: t.tabRoster, icon: <Users className="w-5 h-5" /> },
    { id: 'record', field: 'tabRecord', label: t.tabRecord, icon: <Trophy className="w-5 h-5" /> },
    { id: 'stats', field: 'tabStats', label: t.tabStats, icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'galeria', field: 'tabGaleria', label: t.tabGaleria, icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'info', field: 'tabInfo', label: t.tabInfo, icon: <Info className="w-5 h-5" /> },
  ];

  const primaryMobileTabs = navItems.slice(0, 4);
  const secondaryMobileTabs = navItems.slice(4);
  const isMoreTabActive = secondaryMobileTabs.some((item) => item.id === activeTab);

  const handleNav = (id: TabId) => {
    setActiveTab(id);
    setMoreSheetOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playTapSound();
  };

  const handleToggleSound = () => {
    const next = toggleSoundEnabled();
    setSoundOn(next);
    if (next) playTapSound();
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-14 md:h-16 bg-[#08090f]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNav('versus')}
            className="flex items-center gap-2.5 text-left min-h-[44px] shrink-0 group"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-black border border-purple-500/40 overflow-hidden shrink-0">
              <SmartImage
                src={state.info.logoUrl}
                alt={state.info.name}
                fallbackText={state.info.tag}
                className="w-full h-full object-cover"
              />
            </div>
            <EditableValue
              value={state.info.name}
              target={{ kind: 'clanInfo', field: 'name', label: 'Nombre del Clan' }}
              className="font-heading font-bold text-sm sm:text-base md:text-lg tracking-tight text-white whitespace-nowrap"
            />
          </button>

          {/* Zone 2: Desktop Single-Line Navigation */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-zinc-400">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`py-1.5 whitespace-nowrap shrink-0 transition-colors border-b-2 ${
                    active
                      ? 'text-white border-purple-500 font-semibold'
                      : 'border-transparent hover:text-zinc-200'
                  }`}
                >
                  <EditableText
                    section="nav"
                    field={item.field}
                    label={`Pestaña ${item.label}`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action + Compact Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 bg-zinc-900/90 border border-white/10 rounded-xl px-2.5 min-h-[40px]">
              <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <select
                aria-label={t.timezoneLabel}
                value={selectedTimezone}
                onChange={(e) => {
                  setSelectedTimezone(e.target.value);
                  playTapSound();
                }}
                className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer pr-1"
              >
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz.code} value={tz.tz} className="bg-[#0c0d14] text-white">
                    {tz.flag} {tz.code} ({tz.utcOffset})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleToggleSound}
              aria-label={soundOn ? 'Silenciar sonidos' : 'Activar sonidos'}
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-zinc-900/90 border border-white/10 text-zinc-300 hover:text-white transition-colors"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {isAdmin ? (
              <button
                type="button"
                onClick={() => {
                  onOpenAdminPanel();
                  playTapSound();
                }}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-md shadow-purple-950/40"
              >
                <Shield className="w-3.5 h-3.5" />
                <EditableText section="nav" field="adminPanelBtn" label="Botón Panel Admin" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onOpenAdminAuth();
                  playTapSound();
                }}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-purple-500/40 text-purple-200 font-heading font-semibold text-xs uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <EditableText section="nav" field="adminLoginBtn" label="Botón Acceso Admin" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tablet medium nav strip (between sm and lg) */}
      <div className="hidden md:flex lg:hidden border-b border-white/10 bg-[#0b0c13] px-4 py-1.5 overflow-x-auto no-scrollbar gap-2">
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wide whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <EditableText
                section="nav"
                field={item.field}
                label={`Pestaña ${item.label}`}
              />
            </button>
          );
        })}
      </div>

      {/* Android Thumb-Zone Bottom Tab Bar (< md) */}
      <nav
        aria-label="Navegación móvil"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0d14]/95 backdrop-blur-xl border-t border-white/10 pb-safe"
      >
        <div className="grid grid-cols-5 items-center h-15">
          {primaryMobileTabs.map((item) => {
            const active = activeTab === item.id && !moreSheetOpen;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 px-1 transition-colors ${
                  active ? 'text-purple-400' : 'text-zinc-400 active:text-white'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-colors ${
                    active ? 'bg-purple-500/15 text-purple-400' : ''
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-[11px] font-medium tracking-tight truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => {
              setMoreSheetOpen(true);
              playTapSound();
            }}
            className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 px-1 transition-colors ${
              isMoreTabActive || moreSheetOpen ? 'text-purple-400' : 'text-zinc-400 active:text-white'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-colors ${
                isMoreTabActive || moreSheetOpen ? 'bg-purple-500/15 text-purple-400' : ''
              }`}
            >
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium tracking-tight truncate max-w-full">
              {t.moreMenuLabel}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile "Más" Bottom Sheet Drawer */}
      {moreSheetOpen && (
        <div
          onClick={() => setMoreSheetOpen(false)}
          className="md:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-[#10121c] border-t border-white/15 rounded-t-3xl p-5 pb-safe shadow-2xl"
          >
            <div className="w-10 h-1.5 bg-zinc-700 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <span className="font-heading font-bold text-base uppercase text-white">
                Secciones y Ajustes
              </span>
              <button
                type="button"
                onClick={() => setMoreSheetOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-zinc-400 hover:text-white"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-5">
              {secondaryMobileTabs.map((item) => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNav(item.id)}
                    className={`w-full min-h-[52px] px-4 rounded-2xl flex items-center justify-between border transition-colors ${
                      active
                        ? 'bg-purple-950/50 border-purple-500/50 text-white'
                        : 'bg-black/40 border-white/10 text-zinc-200 active:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-purple-400">{item.icon}</span>
                      <span className="font-heading font-semibold text-sm uppercase tracking-wide">
                        <EditableText
                          section="nav"
                          field={item.field}
                          label={`Pestaña ${item.label}`}
                        />
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <EditableText section="nav" field="timezoneLabel" label="Etiqueta Zona Horaria" />
                </span>
                <select
                  value={selectedTimezone}
                  onChange={(e) => {
                    setSelectedTimezone(e.target.value);
                    playTapSound();
                  }}
                  className="min-h-[40px] bg-zinc-900 text-white text-sm border border-zinc-700 rounded-xl px-3 py-1.5 focus:outline-none"
                >
                  {TIMEZONE_OPTIONS.map((tz) => (
                    <option key={tz.code} value={tz.tz}>
                      {tz.flag} {tz.country}
                    </option>
                  ))}
                </select>
              </div>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setIsInlineTextEditMode(!isInlineTextEditMode);
                    setMoreSheetOpen(false);
                    playTapSound();
                  }}
                  className={`w-full min-h-[46px] px-4 rounded-xl flex items-center justify-between text-xs font-heading font-bold uppercase tracking-wider border ${
                    isInlineTextEditMode
                      ? 'bg-purple-600 border-purple-400 text-white'
                      : 'bg-purple-950/40 border-purple-500/40 text-purple-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Pencil className="w-4 h-4" />
                    {isInlineTextEditMode ? 'Salir de Edición de Textos' : 'Editar Textos en Vivo'}
                  </span>
                  <span>{isInlineTextEditMode ? 'ACTIVO' : 'ACTIVAR'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

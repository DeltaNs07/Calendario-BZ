import React from 'react';
import { ArrowUp, Shield } from 'lucide-react';
import { useClanData } from '../context/ClanDataContext';
import { TabId } from '../types/clan';
import { playTapSound } from '../utils/soundAndEffects';
import { SmartImage } from './SmartImage';
import { EditableText, EditableValue } from './EditableText';

interface FooterProps {
  onSelectTab: (tab: TabId) => void;
  onOpenAdminAuth: () => void;
  onOpenAdminPanel: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenAdminAuth,
  onOpenAdminPanel,
}) => {
  const { state, isAdmin } = useClanData();
  const n = state.texts.nav;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playTapSound();
  };

  const links: { id: TabId; field: keyof typeof n; label: string }[] = [
    { id: 'versus', field: 'tabVersus', label: n.tabVersus },
    { id: 'calendario', field: 'tabCalendario', label: n.tabCalendario },
    { id: 'roster', field: 'tabRoster', label: n.tabRoster },
    { id: 'record', field: 'tabRecord', label: n.tabRecord },
    { id: 'stats', field: 'tabStats', label: n.tabStats },
    { id: 'galeria', field: 'tabGaleria', label: n.tabGaleria },
    { id: 'info', field: 'tabInfo', label: n.tabInfo },
  ];

  return (
    <footer className="bg-[#050508] border-t border-white/10 pt-10 pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/50 border border-purple-500/40 overflow-hidden shrink-0">
            <SmartImage
              src={state.info.logoUrl}
              alt={state.info.name}
              fallbackText={state.info.tag}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <EditableValue
              value={state.info.name}
              target={{ kind: 'clanInfo', field: 'name', label: 'Nombre del Clan' }}
              className="font-heading font-bold text-sm uppercase text-white tracking-wider"
            />
            <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-1 mt-0.5">
              <EditableValue
                value={state.info.game}
                target={{ kind: 'clanInfo', field: 'game', label: 'Juego Principal' }}
              />
              <span>·</span>
              <EditableValue
                value={state.info.server}
                target={{ kind: 'clanInfo', field: 'server', label: 'Región / Servidor' }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-heading font-semibold uppercase tracking-wider text-xs">
          {links.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                scrollToTop();
              }}
              className="min-h-[36px] px-1 hover:text-purple-300 transition-colors"
            >
              <EditableText section="nav" field={item.field} label={`Enlace ${item.label}`} />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          title="Volver arriba"
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white transition-colors border border-white/10 flex items-center gap-1.5"
        >
          <ArrowUp className="w-4 h-4" />
          <EditableText section="footer" field="backToTopLabel" label="Botón Volver arriba" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs">
        <div>
          <span>
            © {new Date().getFullYear()} {state.info.name}.
          </span>
          <span className="mx-2 text-zinc-600">·</span>
          <EditableText section="footer" field="communityLine" label="Texto comunidad footer" />
        </div>

        <div>
          {isAdmin ? (
            <button
              type="button"
              onClick={() => {
                onOpenAdminPanel();
                playTapSound();
              }}
              className="min-h-[40px] text-purple-300 hover:text-purple-200 hover:underline flex items-center gap-1.5 font-heading uppercase font-bold"
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <EditableText section="footer" field="adminActiveLabel" label="Texto Admin Activo" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onOpenAdminAuth();
                playTapSound();
              }}
              className="min-h-[40px] text-zinc-400 hover:text-purple-300 transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4 text-purple-500/80" />
              <EditableText section="footer" field="adminAccessLabel" label="Texto Acceso Admin" />
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

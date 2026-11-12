import React, { useRef, useState } from 'react';
import {
  CheckCircle2,
  Database,
  Download,
  Edit3,
  Image as ImageIcon,
  LogOut,
  Plus,
  RotateCcw,
  Settings,
  Shield,
  Swords,
  Trash2,
  Trophy,
  Type,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { useClanData } from '../../context/ClanDataContext';
import { HistoryMatch, RosterMember, UpcomingMatch } from '../../types/clan';
import { playTapSound } from '../../utils/soundAndEffects';
import { SmartImage } from '../SmartImage';
import { SiteTextsEditorTab } from './SiteTextsEditorTab';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNewMatch: () => void;
  onEditMatch: (match: UpcomingMatch) => void;
  onRecordResult: (match: UpcomingMatch) => void;
  onAddMember: () => void;
  onEditMember: (member: RosterMember) => void;
  onAddHistory: () => void;
  onEditHistory: (match: HistoryMatch) => void;
  onEditClanInfo: () => void;
  onEditLogos: () => void;
}

type AdminTab = 'matches' | 'roster' | 'record' | 'texts' | 'info' | 'backup';

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onAddNewMatch,
  onEditMatch,
  onRecordResult,
  onAddMember,
  onEditMember,
  onAddHistory,
  onEditHistory,
  onEditClanInfo,
  onEditLogos,
}) => {
  const {
    state,
    stats,
    setIsInlineTextEditMode,
    logoutAdmin,
    deleteUpcomingMatch,
    deleteRosterMember,
    deleteHistoryMatch,
    exportBackupJson,
    importBackupJson,
    resetToDefaults,
  } = useClanData();

  const [activeTab, setActiveTab] = useState<AdminTab>('matches');
  const [importStatus, setImportStatus] = useState<'ok' | 'error' | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const ok = importBackupJson(reader.result);
        setImportStatus(ok ? 'ok' : 'error');
      }
    };
    reader.readAsText(file);
  };

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'matches',
      label: `Versus (${state.upcomingMatches.length})`,
      icon: <Swords className="w-4 h-4" />,
    },
    {
      id: 'roster',
      label: `Roster (${state.roster.length})`,
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 'record',
      label: `Récord (${stats.wins}V/${stats.draws}E/${stats.losses}D)`,
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: 'texts',
      label: 'Textos Web',
      icon: <Type className="w-4 h-4" />,
    },
    {
      id: 'info',
      label: 'Ajustes & Lema',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: 'backup',
      label: 'Respaldo JSON',
      icon: <Database className="w-4 h-4" />,
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-5xl bg-[#10121c] border-t sm:border border-purple-500/40 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden pb-safe"
      >
        <div className="w-10 h-1.5 bg-zinc-700 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base sm:text-xl uppercase text-white">
                  Panel de Control Táctico
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-950/70 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded">
                  Admin Activo
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Edita textos completos, logos, versus, roster, récord W-D-L y respaldo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => {
                onEditLogos();
                playTapSound();
              }}
              className="hidden sm:flex min-h-[40px] items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-purple-200 border border-purple-500/30 text-xs font-heading font-semibold uppercase"
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
              Logos
            </button>
            <button
              type="button"
              onClick={() => {
                logoutAdmin();
                onClose();
              }}
              title="Cerrar Sesión Admin"
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar panel"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Tabs */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-white/10 bg-black/30 px-3 sm:px-5 gap-1.5 shrink-0">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  playTapSound();
                }}
                className={`min-h-[46px] py-3 px-3 text-xs font-heading font-bold uppercase tracking-wider border-b-2 flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'border-purple-500 text-purple-300 bg-purple-950/25'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'matches' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h4 className="font-heading font-bold text-sm uppercase text-white">
                    Programación de Enfrentamientos Futuros
                  </h4>
                  <p className="text-xs text-zinc-400">
                    El primer versus de la lista alimenta la cuenta regresiva principal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onAddNewMatch();
                    playTapSound();
                  }}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold text-xs uppercase flex items-center justify-center gap-1.5 shadow-md shadow-purple-950/40 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Agendar Versus
                </button>
              </div>

              <div className="space-y-3">
                {state.upcomingMatches.map((match, idx) => (
                  <div
                    key={match.id}
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-950/50 border border-purple-500/30 flex items-center justify-center font-heading font-bold text-purple-300 text-xs shrink-0">
                        {idx === 0 ? '★' : `#${idx + 1}`}
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-black border border-white/15 overflow-hidden shrink-0">
                        <SmartImage
                          src={match.opponentLogo}
                          alt={match.opponentName}
                          fallbackText={match.opponentTag}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-heading font-bold text-sm text-white flex flex-wrap items-center gap-1.5">
                          <span>VS {match.opponentName}</span>
                          <span className="text-xs text-rose-400">{match.opponentTag}</span>
                        </div>
                        <div className="text-xs text-zinc-400 truncate">
                          {match.modality} · {match.map} · {match.matchDate.slice(0, 16).replace('T', ' ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          onRecordResult(match);
                          playTapSound();
                        }}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500 hover:text-black text-xs font-semibold flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Pasar a Récord
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onEditMatch(match);
                          playTapSound();
                        }}
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                        title="Editar"
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
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-rose-500 text-zinc-200 hover:text-white"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'roster' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h4 className="font-heading font-bold text-sm uppercase text-white">
                    Gestión de Operadores del Clan ({state.roster.length} Miembros)
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Agrega reclutas, edita fotos, K/D, armas o alterna entre titulares y reservas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onAddMember();
                    playTapSound();
                  }}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold text-xs uppercase flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Añadir Jugador
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {state.roster.map((member) => (
                  <div
                    key={member.id}
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-purple-500/35 shrink-0">
                        <SmartImage
                          src={member.avatarUrl}
                          alt={member.gamertag}
                          fallbackText={member.gamertag}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-heading font-bold text-sm text-white flex items-center gap-2 truncate">
                          <span className="truncate">{member.gamertag}</span>
                          <span className="text-[11px] font-sans text-purple-300 shrink-0">
                            {member.isStarter ? 'Titular' : 'Reserva'}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 truncate">
                          {member.role} · {member.kdRatio} K/D
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onEditMember(member);
                          playTapSound();
                        }}
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                        title="Editar Jugador y Foto"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`¿Eliminar a ${member.gamertag}?`)) {
                            deleteRosterMember(member.id);
                          }
                        }}
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-rose-500 text-zinc-200 hover:text-white"
                        title="Eliminar Jugador"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'record' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <h4 className="font-heading font-bold text-sm uppercase text-white">
                    Historial y Marcadores Oficiales
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {stats.wins} Victorias · {stats.draws} Empates · {stats.losses} Derrotas ({stats.winRate}% Win Rate)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onAddHistory();
                    playTapSound();
                  }}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold text-xs uppercase flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Registrar Partido
                </button>
              </div>

              <div className="space-y-2.5">
                {state.history.map((match) => (
                  <div
                    key={match.id}
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-heading font-bold text-sm text-white">
                        {state.info.tag} {match.ourScore} - {match.opponentScore} {match.opponentName}{' '}
                        <span className="text-xs font-normal text-zinc-400">({match.date})</span>
                      </div>
                      <div className="text-xs text-zinc-400">
                        {match.modality} · {match.map}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          onEditHistory(match);
                          playTapSound();
                        }}
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`¿Eliminar partido contra ${match.opponentName}?`)) {
                            deleteHistoryMatch(match.id);
                          }
                        }}
                        className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-zinc-800 hover:bg-rose-500 text-zinc-200 hover:text-white"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'texts' && (
            <SiteTextsEditorTab
              onEnableLiveInlineMode={() => {
                setIsInlineTextEditMode(true);
                onClose();
              }}
            />
          )}

          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-heading font-bold text-base uppercase text-white">
                    Información General, Lema y Canales
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Edita el nombre del clan, tag, lema, comunicado superior, enlaces y requisitos.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onEditLogos();
                      playTapSound();
                    }}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-purple-200 text-xs font-heading font-bold uppercase flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Editar Logos
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onEditClanInfo();
                      playTapSound();
                    }}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-heading font-bold uppercase flex items-center gap-1.5"
                  >
                    <Edit3 className="w-4 h-4" />
                    Editar Info del Clan
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div>
                  <h4 className="font-heading font-bold text-base uppercase text-white">
                    Copia de Seguridad (Exportar / Importar JSON)
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Descarga toda la configuración (versus, roster, historial, galería, logos y textos) o restaura desde un archivo JSON.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={exportBackupJson}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-heading font-bold uppercase flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Descargar Respaldo JSON
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-heading font-bold uppercase flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Importar JSON
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json"
                    onChange={handleImportFile}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          '¿Restablecer toda la web a los datos iniciales de fábrica? Se perderán tus cambios locales.'
                        )
                      ) {
                        resetToDefaults();
                      }
                    }}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/30 text-xs font-heading font-bold uppercase flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restablecer Fábrica
                  </button>
                </div>

                {importStatus === 'ok' && (
                  <p className="text-xs text-emerald-400">
                    Respaldo importado correctamente.
                  </p>
                )}
                {importStatus === 'error' && (
                  <p className="text-xs text-rose-400">
                    El archivo JSON no tiene el formato válido del clan.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

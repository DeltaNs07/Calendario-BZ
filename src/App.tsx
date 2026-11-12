import React, { useState } from 'react';
import { Check, Eye, Image as ImageIcon, Pencil, Shield, Trophy, Users } from 'lucide-react';
import { ClanDataProvider, useClanData } from './context/ClanDataContext';
import { HistoryMatch, RosterMember, TabId, UpcomingMatch } from './types/clan';
import { playTapSound } from './utils/soundAndEffects';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CalendarSection } from './components/CalendarSection';
import { RosterSection } from './components/RosterSection';
import { HistorySection } from './components/HistorySection';
import { StatsSection } from './components/StatsSection';
import { GallerySection } from './components/GallerySection';
import { InfoSection } from './components/InfoSection';
import { Footer } from './components/Footer';
import { SmartImage } from './components/SmartImage';
import { EditableText, EditableValue } from './components/EditableText';
import { QuickTextEditModal } from './components/QuickTextEditModal';
import { AdminAuthModal } from './components/modals/AdminAuthModal';
import { AdminPanelModal } from './components/modals/AdminPanelModal';
import { EditLogosModal } from './components/modals/EditLogosModal';
import { MatchFormModal } from './components/modals/MatchFormModal';
import { RosterFormModal } from './components/modals/RosterFormModal';
import { HistoryFormModal } from './components/modals/HistoryFormModal';
import { ClanInfoFormModal } from './components/modals/ClanInfoFormModal';
import { GalleryFormModal } from './components/modals/GalleryFormModal';
import { RecordResultModal } from './components/modals/RecordResultModal';

const ClanAppContent: React.FC = () => {
  const { state, isAdmin, isInlineTextEditMode, setIsInlineTextEditMode } = useClanData();

  const [activeTab, setActiveTab] = useState<TabId>('versus');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [logosModalOpen, setLogosModalOpen] = useState(false);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchToEdit, setMatchToEdit] = useState<UpcomingMatch | null>(null);
  const [recordResultOpen, setRecordResultOpen] = useState(false);
  const [matchToRecord, setMatchToRecord] = useState<UpcomingMatch | null>(null);
  const [rosterModalOpen, setRosterModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<RosterMember | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyToEdit, setHistoryToEdit] = useState<HistoryMatch | null>(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  const openAddMatch = () => {
    setMatchToEdit(null);
    setMatchModalOpen(true);
  };

  const openEditMatch = (match: UpcomingMatch) => {
    setMatchToEdit(match);
    setMatchModalOpen(true);
  };

  const openRecordResult = (match: UpcomingMatch) => {
    setMatchToRecord(match);
    setRecordResultOpen(true);
  };

  const openAddMember = () => {
    setMemberToEdit(null);
    setRosterModalOpen(true);
  };

  const openEditMember = (member: RosterMember) => {
    setMemberToEdit(member);
    setRosterModalOpen(true);
  };

  const openAddHistory = () => {
    setHistoryToEdit(null);
    setHistoryModalOpen(true);
  };

  const openEditHistory = (match: HistoryMatch) => {
    setHistoryToEdit(match);
    setHistoryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdminAuth={() => setAuthModalOpen(true)}
        onOpenAdminPanel={() => setAdminPanelOpen(true)}
      />

      {/* Live Text Edit Mode Banner */}
      {isAdmin && isInlineTextEditMode && (
        <div className="sticky top-14 md:top-16 z-30 bg-purple-950/95 border-b border-purple-400/50 backdrop-blur-md px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-purple-100">
              <Pencil className="w-4 h-4 text-purple-300 shrink-0" />
              <span>
                <strong>Modo Edición de Textos Activo:</strong> Toca cualquier texto marcado para cambiarlo al instante.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsInlineTextEditMode(false);
                playTapSound();
              }}
              className="min-h-[36px] px-3.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              Vista Previa
            </button>
          </div>
        </div>
      )}

      <main className="flex-1">
        {activeTab === 'versus' && (
          <div>
            <HeroSection
              onEditNextMatch={() => {
                if (state.upcomingMatches[0]) {
                  openEditMatch(state.upcomingMatches[0]);
                } else {
                  openAddMatch();
                }
              }}
              onEditLogos={() => setLogosModalOpen(true)}
              onNavigateToCalendar={() => {
                setActiveTab('calendario');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToRoster={() => {
                setActiveTab('roster');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
              {/* Featured Squad */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-4 pb-2.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400 shrink-0" />
                    <h3 className="font-heading font-bold text-base sm:text-lg uppercase text-white">
                      <EditableText
                        section="hero"
                        field="featuredSquadTitle"
                        label="Título Escuadrón Destacado"
                      />
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('roster');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      playTapSound();
                    }}
                    className="min-h-[38px] text-xs font-heading uppercase text-purple-400 hover:text-purple-300 font-semibold whitespace-nowrap shrink-0"
                  >
                    <EditableText
                      section="hero"
                      field="featuredSquadLink"
                      label="Enlace Ver Roster"
                      suffix={` (${state.roster.length}) →`}
                    />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {state.roster.slice(0, 4).map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => {
                        setActiveTab('roster');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        playTapSound();
                      }}
                      className="text-left bg-[#10121b] border border-white/10 hover:border-purple-500/40 rounded-2xl p-3 flex items-center gap-3 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-xl overflow-hidden border border-purple-500/35 shrink-0">
                        <SmartImage
                          src={member.avatarUrl}
                          alt={member.gamertag}
                          fallbackText={member.gamertag}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-heading font-bold text-xs sm:text-sm uppercase text-white truncate">
                          <EditableValue
                            value={member.gamertag}
                            target={{
                              kind: 'rosterMember',
                              id: member.id,
                              field: 'gamertag',
                              label: 'Gamertag del Jugador',
                            }}
                          />
                        </div>
                        <div className="text-[11px] text-purple-400 truncate mt-0.5">
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
                        <div className="text-[11px] text-zinc-400 font-mono-numbers mt-0.5 truncate">
                          {member.kdRatio} K/D ·{' '}
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
                    </button>
                  ))}
                </div>
              </div>

              {/* Competitive Record Promo Banner */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950/45 via-[#10121b] to-black border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <div className="text-xs font-heading font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4" />
                    <EditableText section="hero" field="promoKicker" label="Kicker Banner Récord" />
                  </div>
                  <div className="text-lg sm:text-2xl font-bold uppercase font-heading text-white [text-wrap:balance]">
                    <EditableText section="hero" field="promoTitle" label="Título Banner Récord" />
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 mt-1.5 max-w-xl leading-relaxed">
                    <EditableText
                      section="hero"
                      field="promoDesc"
                      label="Descripción Banner Récord"
                      multiline
                    />
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('record');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      playTapSound();
                    }}
                    className="min-h-[46px] px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-purple-950/40 whitespace-nowrap"
                  >
                    <EditableText
                      section="hero"
                      field="promoBtnRecord"
                      label="Botón Ver Récord"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('stats');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      playTapSound();
                    }}
                    className="min-h-[46px] px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-heading font-semibold text-xs uppercase tracking-wider transition-colors border border-white/10 whitespace-nowrap"
                  >
                    <EditableText
                      section="hero"
                      field="promoBtnStats"
                      label="Botón Estadísticas"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendario' && (
          <CalendarSection
            onAddNewMatch={openAddMatch}
            onEditMatch={openEditMatch}
            onRecordResult={openRecordResult}
          />
        )}
        {activeTab === 'roster' && (
          <RosterSection onAddMember={openAddMember} onEditMember={openEditMember} />
        )}
        {activeTab === 'record' && (
          <HistorySection
            onAddHistoryMatch={openAddHistory}
            onEditHistoryMatch={openEditHistory}
          />
        )}
        {activeTab === 'stats' && <StatsSection />}
        {activeTab === 'galeria' && <GallerySection onAddImage={() => setGalleryModalOpen(true)} />}
        {activeTab === 'info' && (
          <InfoSection
            onEditInfo={() => setInfoModalOpen(true)}
            onEditLogos={() => setLogosModalOpen(true)}
          />
        )}
      </main>

      {/* Floating Admin Bar (Positioned safely above Android bottom nav bar) */}
      {isAdmin && (
        <div className="fixed bottom-20 md:bottom-4 right-3 sm:right-4 z-40 bg-[#10121c]/95 border border-purple-500/50 rounded-2xl p-2 shadow-2xl backdrop-blur-md flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => {
              setIsInlineTextEditMode(!isInlineTextEditMode);
              playTapSound();
            }}
            className={`min-h-[40px] px-3 py-1.5 rounded-xl font-heading font-bold uppercase text-xs flex items-center gap-1.5 transition-colors ${
              isInlineTextEditMode
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-zinc-800 hover:bg-zinc-700 text-purple-200 border border-purple-500/30'
            }`}
            title="Activar o desactivar edición directa de textos en pantalla"
          >
            {isInlineTextEditMode ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Pencil className="w-3.5 h-3.5" />
            )}
            <span>{isInlineTextEditMode ? 'Editando Textos' : 'Editar Textos'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLogosModalOpen(true);
              playTapSound();
            }}
            className="hidden sm:flex min-h-[40px] px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-purple-200 border border-purple-500/30 font-heading font-bold uppercase text-xs items-center gap-1.5"
            title="Cambiar Logo y Portada"
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>Logos</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAdminPanelOpen(true);
              playTapSound();
            }}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold uppercase text-xs flex items-center gap-1.5 shadow-md shadow-purple-950/40"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Panel</span>
          </button>
        </div>
      )}

      <Footer
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenAdminAuth={() => setAuthModalOpen(true)}
        onOpenAdminPanel={() => setAdminPanelOpen(true)}
      />

      {/* Modals */}
      <QuickTextEditModal />
      <AdminAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAdminPanelOpen(true)}
      />
      <AdminPanelModal
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
        onAddNewMatch={openAddMatch}
        onEditMatch={openEditMatch}
        onRecordResult={openRecordResult}
        onAddMember={openAddMember}
        onEditMember={openEditMember}
        onAddHistory={openAddHistory}
        onEditHistory={openEditHistory}
        onEditClanInfo={() => setInfoModalOpen(true)}
        onEditLogos={() => setLogosModalOpen(true)}
      />
      <EditLogosModal isOpen={logosModalOpen} onClose={() => setLogosModalOpen(false)} />
      <MatchFormModal
        isOpen={matchModalOpen}
        onClose={() => setMatchModalOpen(false)}
        matchToEdit={matchToEdit}
      />
      <RosterFormModal
        isOpen={rosterModalOpen}
        onClose={() => setRosterModalOpen(false)}
        memberToEdit={memberToEdit}
      />
      <HistoryFormModal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        matchToEdit={historyToEdit}
      />
      <ClanInfoFormModal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)} />
      <GalleryFormModal isOpen={galleryModalOpen} onClose={() => setGalleryModalOpen(false)} />
      <RecordResultModal
        isOpen={recordResultOpen}
        onClose={() => setRecordResultOpen(false)}
        match={matchToRecord}
      />
    </div>
  );
};

export default function App() {
  return (
    <ClanDataProvider>
      <ClanAppContent />
    </ClanDataProvider>
  );
}

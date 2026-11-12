import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  ClanInfo,
  ClanState,
  ClanStats,
  GalleryItem,
  HistoryMatch,
  RosterMember,
  SiteTexts,
  UpcomingMatch,
} from '../types/clan';
import { DEFAULT_CLAN_STATE, DEFAULT_TEXTS, mergeWithDefaultTexts } from '../data/defaultClanData';
import { playSuccessChime, playTapSound } from '../utils/soundAndEffects';

const STORAGE_KEY = 'baztardos_clan_state_v1';
const ADMIN_SESSION_KEY = 'baztardos_admin_session';

export type InlineEditTarget =
  | {
      kind: 'siteText';
      section: keyof SiteTexts;
      field: string;
      label: string;
      multiline?: boolean;
    }
  | {
      kind: 'clanInfo';
      field: 'name' | 'tag' | 'motto' | 'game' | 'server' | 'foundedYear' | 'announcement';
      label: string;
      multiline?: boolean;
    }
  | {
      kind: 'requirement';
      index: number;
      label: string;
    }
  | {
      kind: 'rule';
      index: number;
      key: 'title' | 'desc';
      label: string;
      multiline?: boolean;
    }
  | {
      kind: 'mapStat';
      index: number;
      key: 'name' | 'bestScore';
      label: string;
    }
  | {
      kind: 'upcomingMatch';
      id: string;
      field:
        | 'tournamentName'
        | 'opponentName'
        | 'opponentTag'
        | 'modality'
        | 'map'
        | 'serverRegion'
        | 'caster'
        | 'notes';
      label: string;
      multiline?: boolean;
    }
  | {
      kind: 'rosterMember';
      id: string;
      field:
        | 'gamertag'
        | 'realName'
        | 'role'
        | 'rank'
        | 'favoriteOperator'
        | 'favoriteWeapon'
        | 'country';
      label: string;
    }
  | {
      kind: 'historyMatch';
      id: string;
      field: 'opponentName' | 'map' | 'modality' | 'mvp' | 'ticketsDifference' | 'notes';
      label: string;
      multiline?: boolean;
    }
  | {
      kind: 'galleryItem';
      id: string;
      field: 'title' | 'caption' | 'date';
      label: string;
      multiline?: boolean;
    };

interface ClanDataContextValue {
  state: ClanState;
  isAdmin: boolean;
  isInlineTextEditMode: boolean;
  setIsInlineTextEditMode: (val: boolean) => void;
  editingTextTarget: InlineEditTarget | null;
  openQuickTextEdit: (target: InlineEditTarget) => void;
  closeQuickTextEdit: () => void;
  selectedTimezone: string;
  setSelectedTimezone: (tz: string) => void;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  updateClanInfo: (partial: Partial<ClanInfo>) => void;
  updateSiteTexts: (section: keyof SiteTexts, partial: Record<string, unknown>) => void;
  setSingleSiteText: (section: keyof SiteTexts, field: string, value: string) => void;
  resetSiteTexts: () => void;
  addUpcomingMatch: (match: Omit<UpcomingMatch, 'id'>) => void;
  updateUpcomingMatch: (id: string, partial: Partial<UpcomingMatch>) => void;
  deleteUpcomingMatch: (id: string) => void;
  addRosterMember: (member: Omit<RosterMember, 'id'>) => void;
  updateRosterMember: (id: string, partial: Partial<RosterMember>) => void;
  deleteRosterMember: (id: string) => void;
  addHistoryMatch: (match: Omit<HistoryMatch, 'id'>) => void;
  updateHistoryMatch: (id: string, partial: Partial<HistoryMatch>) => void;
  deleteHistoryMatch: (id: string) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  updateGalleryItem: (id: string, partial: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  resetToDefaults: () => void;
  exportBackupJson: () => void;
  importBackupJson: (jsonText: string) => boolean;
  stats: ClanStats;
}

const ClanDataContext = createContext<ClanDataContextValue | undefined>(undefined);

function hydrateState(raw: unknown): ClanState {
  if (!raw || typeof raw !== 'object') return DEFAULT_CLAN_STATE;
  const parsed = raw as Partial<ClanState>;
  if (!parsed.info || !Array.isArray(parsed.upcomingMatches) || !Array.isArray(parsed.roster)) {
    return DEFAULT_CLAN_STATE;
  }
  return {
    info: { ...DEFAULT_CLAN_STATE.info, ...parsed.info },
    upcomingMatches: parsed.upcomingMatches,
    roster: parsed.roster,
    history: Array.isArray(parsed.history) ? parsed.history : DEFAULT_CLAN_STATE.history,
    gallery: Array.isArray(parsed.gallery) ? parsed.gallery : DEFAULT_CLAN_STATE.gallery,
    texts: mergeWithDefaultTexts(parsed.texts),
  };
}

export const ClanDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ClanState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return hydrateState(JSON.parse(saved));
      }
    } catch {
      // Fallback to defaults
    }
    return DEFAULT_CLAN_STATE;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isInlineTextEditMode, setIsInlineTextEditMode] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [editingTextTarget, setEditingTextTarget] = useState<InlineEditTarget | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState<string>('America/Bogota');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save clan state to localStorage', err);
    }
  }, [state]);

  const loginAdmin = (pin: string) => {
    if (pin.trim() === '2507') {
      setIsAdmin(true);
      setIsInlineTextEditMode(true);
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch {
        // Ignore storage errors
      }
      playSuccessChime();
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    setIsInlineTextEditMode(false);
    setEditingTextTarget(null);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // Ignore storage errors
    }
    playTapSound();
  };

  const openQuickTextEdit = (target: InlineEditTarget) => {
    setEditingTextTarget(target);
    playTapSound();
  };

  const closeQuickTextEdit = () => {
    setEditingTextTarget(null);
  };

  const updateClanInfo = (partial: Partial<ClanInfo>) => {
    setState((prev) => ({ ...prev, info: { ...prev.info, ...partial } }));
    playTapSound();
  };

  const updateSiteTexts = (section: keyof SiteTexts, partial: Record<string, unknown>) => {
    setState((prev) => ({
      ...prev,
      texts: {
        ...prev.texts,
        [section]: {
          ...prev.texts[section],
          ...partial,
        },
      },
    }));
  };

  const setSingleSiteText = (section: keyof SiteTexts, field: string, value: string) => {
    setState((prev) => ({
      ...prev,
      texts: {
        ...prev.texts,
        [section]: {
          ...prev.texts[section],
          [field]: value,
        },
      },
    }));
    playTapSound();
  };

  const resetSiteTexts = () => {
    setState((prev) => ({ ...prev, texts: DEFAULT_TEXTS }));
    playTapSound();
  };

  const addUpcomingMatch = (match: Omit<UpcomingMatch, 'id'>) => {
    const item: UpcomingMatch = { ...match, id: `match-${Date.now()}` };
    setState((prev) => ({ ...prev, upcomingMatches: [item, ...prev.upcomingMatches] }));
    playTapSound();
  };

  const updateUpcomingMatch = (id: string, partial: Partial<UpcomingMatch>) => {
    setState((prev) => ({
      ...prev,
      upcomingMatches: prev.upcomingMatches.map((m) => (m.id === id ? { ...m, ...partial } : m)),
    }));
    playTapSound();
  };

  const deleteUpcomingMatch = (id: string) => {
    setState((prev) => ({
      ...prev,
      upcomingMatches: prev.upcomingMatches.filter((m) => m.id !== id),
    }));
    playTapSound();
  };

  const addRosterMember = (member: Omit<RosterMember, 'id'>) => {
    const item: RosterMember = { ...member, id: `ros-${Date.now()}` };
    setState((prev) => ({ ...prev, roster: [...prev.roster, item] }));
    playTapSound();
  };

  const updateRosterMember = (id: string, partial: Partial<RosterMember>) => {
    setState((prev) => ({
      ...prev,
      roster: prev.roster.map((m) => (m.id === id ? { ...m, ...partial } : m)),
    }));
    playTapSound();
  };

  const deleteRosterMember = (id: string) => {
    setState((prev) => ({
      ...prev,
      roster: prev.roster.filter((m) => m.id !== id),
    }));
    playTapSound();
  };

  const addHistoryMatch = (match: Omit<HistoryMatch, 'id'>) => {
    const item: HistoryMatch = { ...match, id: `hist-${Date.now()}` };
    setState((prev) => ({ ...prev, history: [item, ...prev.history] }));
    playSuccessChime();
  };

  const updateHistoryMatch = (id: string, partial: Partial<HistoryMatch>) => {
    setState((prev) => ({
      ...prev,
      history: prev.history.map((m) => (m.id === id ? { ...m, ...partial } : m)),
    }));
    playTapSound();
  };

  const deleteHistoryMatch = (id: string) => {
    setState((prev) => ({
      ...prev,
      history: prev.history.filter((m) => m.id !== id),
    }));
    playTapSound();
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const entry: GalleryItem = { ...item, id: `gal-${Date.now()}` };
    setState((prev) => ({ ...prev, gallery: [entry, ...prev.gallery] }));
    playTapSound();
  };

  const updateGalleryItem = (id: string, partial: Partial<GalleryItem>) => {
    setState((prev) => ({
      ...prev,
      gallery: prev.gallery.map((g) => (g.id === id ? { ...g, ...partial } : g)),
    }));
    playTapSound();
  };

  const deleteGalleryItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g.id !== id),
    }));
    playTapSound();
  };

  const resetToDefaults = () => {
    setState(DEFAULT_CLAN_STATE);
    localStorage.removeItem(STORAGE_KEY);
    playTapSound();
  };

  const exportBackupJson = () => {
    const dataUri =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute(
      'download',
      `BAZTARDOS_GAMING_BACKUP_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const importBackupJson = (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText);
      if (parsed.info && Array.isArray(parsed.upcomingMatches) && Array.isArray(parsed.roster)) {
        setState(hydrateState(parsed));
        playSuccessChime();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const stats: ClanStats = useMemo(() => {
    const wins = state.history.filter((m) => m.outcome === 'win').length;
    const draws = state.history.filter((m) => m.outcome === 'draw').length;
    const losses = state.history.filter((m) => m.outcome === 'loss').length;
    const totalMatches = wins + draws + losses;
    const winRate = totalMatches > 0 ? ((wins / totalMatches) * 100).toFixed(1) : '0.0';
    const totalRoster = state.roster.length;
    const startersCount = state.roster.filter((m) => m.isStarter).length;
    const sumKd = state.roster.reduce((acc, m) => acc + (m.kdRatio || 0), 0);
    const tournamentsParsed = parseInt(state.texts.stats.tournamentsCardCount, 10);
    return {
      totalMatches,
      wins,
      draws,
      losses,
      winRate,
      totalRoster,
      startersCount,
      avgKd: totalRoster > 0 ? (sumKd / totalRoster).toFixed(2) : '0.00',
      tournamentsCount: Number.isNaN(tournamentsParsed) ? 4 : tournamentsParsed,
    };
  }, [state.history, state.roster, state.texts.stats.tournamentsCardCount]);

  return (
    <ClanDataContext.Provider
      value={{
        state,
        isAdmin,
        isInlineTextEditMode,
        setIsInlineTextEditMode,
        editingTextTarget,
        openQuickTextEdit,
        closeQuickTextEdit,
        selectedTimezone,
        setSelectedTimezone,
        loginAdmin,
        logoutAdmin,
        updateClanInfo,
        updateSiteTexts,
        setSingleSiteText,
        resetSiteTexts,
        addUpcomingMatch,
        updateUpcomingMatch,
        deleteUpcomingMatch,
        addRosterMember,
        updateRosterMember,
        deleteRosterMember,
        addHistoryMatch,
        updateHistoryMatch,
        deleteHistoryMatch,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        resetToDefaults,
        exportBackupJson,
        importBackupJson,
        stats,
      }}
    >
      {children}
    </ClanDataContext.Provider>
  );
};

export function useClanData() {
  const ctx = useContext(ClanDataContext);
  if (!ctx) throw new Error('useClanData must be used within a ClanDataProvider');
  return ctx;
}

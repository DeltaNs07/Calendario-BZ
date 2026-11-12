export type TabId =
  | 'versus'
  | 'calendario'
  | 'roster'
  | 'record'
  | 'stats'
  | 'galeria'
  | 'info';

export interface ClanInfo {
  name: string;
  tag: string;
  motto: string;
  game: string;
  server: string;
  logoUrl: string;
  bannerUrl: string;
  discordUrl: string;
  whatsappUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  recruitmentOpen: boolean;
  recruitmentRequirements: string[];
  announcement: string;
  foundedYear: string;
  customAdminPin: string;
}

export interface UpcomingMatch {
  id: string;
  opponentName: string;
  opponentTag: string;
  opponentLogo: string;
  matchDate: string;
  modality: string;
  map: string;
  mapImage?: string;
  serverRegion: string;
  streamUrl?: string;
  caster?: string;
  tournamentName?: string;
  notes?: string;
}

export interface RosterMember {
  id: string;
  gamertag: string;
  realName?: string;
  role: string;
  favoriteOperator: string;
  favoriteWeapon: string;
  rank: string;
  kdRatio: number;
  matchesPlayed: number;
  winRate: number;
  country: string;
  countryCode: string;
  avatarUrl: string;
  isStarter: boolean;
  joinDate: string;
}

export type MatchOutcome = 'win' | 'draw' | 'loss';

export interface HistoryMatch {
  id: string;
  opponentName: string;
  opponentTag: string;
  opponentLogo: string;
  date: string;
  modality: string;
  map: string;
  ourScore: number;
  opponentScore: number;
  outcome: MatchOutcome;
  mvp: string;
  ticketsDifference: string;
  notes?: string;
  vodLink?: string;
}

export type GalleryCategory = 'victorias' | 'torneos' | 'jugadas' | 'comunidad';

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: GalleryCategory;
  date: string;
}

export interface ClanRuleItem {
  title: string;
  desc: string;
}

export interface MapStatItem {
  name: string;
  winRate: number;
  played: number;
  bestScore: string;
}

export interface SiteTexts {
  nav: {
    brandSubtitle: string;
    tabVersus: string;
    tabCalendario: string;
    tabRoster: string;
    tabRecord: string;
    tabStats: string;
    tabGaleria: string;
    tabInfo: string;
    moreMenuLabel: string;
    timezoneLabel: string;
    adminLoginBtn: string;
    adminPanelBtn: string;
  };
  hero: {
    announcementBadge: string;
    kickerSub: string;
    localTeamLabel: string;
    captainPrefix: string;
    visitorTeamLabel: string;
    vsBadge: string;
    countdownTitle: string;
    liveBadge: string;
    finishedBadge: string;
    daysLabel: string;
    hoursLabel: string;
    minutesLabel: string;
    secondsLabel: string;
    worldTimesTitle: string;
    swipeHint: string;
    ctaCalendar: string;
    ctaRoster: string;
    ctaStream: string;
    emptyTitle: string;
    emptyDesc: string;
    featuredSquadTitle: string;
    featuredSquadLink: string;
    promoKicker: string;
    promoTitle: string;
    promoDesc: string;
    promoBtnRecord: string;
    promoBtnStats: string;
  };
  calendar: {
    kicker: string;
    title: string;
    subtitle: string;
    addBtn: string;
    timezoneNote: string;
    expandTimesBtn: string;
    collapseTimesBtn: string;
    worldTimesHeading: string;
    notesPrefix: string;
    streamBtn: string;
    casterPrefix: string;
    emptyTitle: string;
    emptyDesc: string;
  };
  roster: {
    kicker: string;
    title: string;
    subtitle: string;
    addBtn: string;
    filterAll: string;
    filterStarters: string;
    filterSubs: string;
    allRolesOption: string;
    starterBadge: string;
    subBadge: string;
    operatorLabel: string;
    weaponLabel: string;
    kdLabel: string;
    matchesLabel: string;
    winRateLabel: string;
    makeSubBtn: string;
    makeStarterBtn: string;
    emptyTitle: string;
    emptyDesc: string;
  };
  record: {
    kicker: string;
    title: string;
    subtitle: string;
    addBtn: string;
    cardPlayedTitle: string;
    cardPlayedSub: string;
    cardWinsTitle: string;
    cardWinsSub: string;
    cardDrawsTitle: string;
    cardDrawsSub: string;
    cardLossesTitle: string;
    cardLossesSub: string;
    cardWinRateTitle: string;
    cardWinRateSub: string;
    filterAll: string;
    filterWins: string;
    filterDraws: string;
    filterLosses: string;
    modeLabel: string;
    allModesOption: string;
    winBadge: string;
    drawBadge: string;
    lossBadge: string;
    mvpLabel: string;
    vodBtn: string;
    emptyTitle: string;
  };
  stats: {
    kicker: string;
    title: string;
    subtitle: string;
    winRateCardTitle: string;
    winRateCardDescPrefix: string;
    winRateCardDescSuffix: string;
    avgKdCardTitle: string;
    avgKdCardDesc: string;
    avgKdRangeLabel: string;
    avgKdTierLabel: string;
    tournamentsCardTitle: string;
    tournamentsCardCount: string;
    tournamentsCardDesc: string;
    tournamentsHighlight: string;
    kdLeadersTitle: string;
    kdLeadersSub: string;
    mapsTitle: string;
    mapsSub: string;
    mapFortressLabel: string;
    mapCompetitiveLabel: string;
    bestScorePrefix: string;
    mapStats: MapStatItem[];
  };
  gallery: {
    kicker: string;
    title: string;
    subtitle: string;
    addBtn: string;
    filterAll: string;
    catVictorias: string;
    catTorneos: string;
    catJugadas: string;
    catComunidad: string;
    emptyTitle: string;
  };
  info: {
    kicker: string;
    title: string;
    subtitle: string;
    foundedPrefix: string;
    gameLabel: string;
    serverLabel: string;
    recruitmentLabel: string;
    statusOpen: string;
    statusClosed: string;
    channelsTitle: string;
    discordLabel: string;
    whatsappLabel: string;
    youtubeLabel: string;
    tiktokLabel: string;
    reqTitle: string;
    reqOpenBadge: string;
    reqClosedBadge: string;
    reqIntro: string;
    rulesTitle: string;
    rules: ClanRuleItem[];
  };
  footer: {
    communityLine: string;
    backToTopLabel: string;
    adminActiveLabel: string;
    adminAccessLabel: string;
  };
}

export interface ClanState {
  info: ClanInfo;
  upcomingMatches: UpcomingMatch[];
  roster: RosterMember[];
  history: HistoryMatch[];
  gallery: GalleryItem[];
  texts: SiteTexts;
}

export interface TimeZoneOption {
  code: string;
  country: string;
  city: string;
  flag: string;
  tz: string;
  utcOffset: string;
}

export interface ClanStats {
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: string;
  totalRoster: number;
  startersCount: number;
  avgKd: string;
  tournamentsCount: number;
}

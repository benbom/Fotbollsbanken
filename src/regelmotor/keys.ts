/**
 * Frysta domännycklar och de tabellvärden schemat behöver.
 *
 * ADR 0011 avsnitt 1: keys.ts är den enda platsen där domänens siffror finns, och varje
 * tabell pekar ut sin källfil och sitt regel-ID. Filen fylls på när regelmotorn byggs;
 * här finns det som övningsschemat (ADR 0010) behöver.
 *
 * Domännycklarna är data och behåller sin svenska stavning (ADR 0011, *Namn*).
 */

/** Åldersfaser. Källa: docs/doman/aldrar-och-fokus.md, R-012. */
export const PHASES = ['fas-6-7', 'fas-8-9', 'fas-10-12', 'fas-13-14', 'fas-15-19'] as const;
export type Phase = (typeof PHASES)[number];

/** Åldersspann per fas. Källa: R-012. */
export const PHASE_AGES: Record<Phase, { min: number; max: number }> = {
  'fas-6-7': { min: 6, max: 7 },
  'fas-8-9': { min: 8, max: 9 },
  'fas-10-12': { min: 10, max: 12 },
  'fas-13-14': { min: 13, max: 14 },
  'fas-15-19': { min: 15, max: 19 },
};

/** Lägsta och högsta ålder appen stöder. Källa: R-011, R-003. */
export const AGE_MIN = 6;
export const AGE_MAX = 19;

/** Spelformer i ordning. Källa: docs/doman/spelformer.md, R-014. */
export const GAME_FORMATS = ['3mot3', '5mot5', '7mot7', '9mot9', '11mot11'] as const;
export type GameFormat = (typeof GAME_FORMATS)[number];

/** Spelform som föreslås för en ålder. Källa: spelformer.md, R-013. */
export const GAME_FORMAT_AGES: Record<GameFormat, { min: number; max: number }> = {
  '3mot3': { min: 6, max: 7 },
  '5mot5': { min: 8, max: 9 },
  '7mot7': { min: 10, max: 12 },
  '9mot9': { min: 13, max: 14 },
  '11mot11': { min: 15, max: 19 },
};

/** Nivåer. Källa: docs/doman/nivaer.md, R-001, R-016. */
export const LEVELS = ['niva-1', 'niva-2', 'niva-3'] as const;
export type Level = (typeof LEVELS)[number];

/** Passdelar som fylls från banken. Källa: docs/doman/passuppbyggnad.md, R-005, R-030. */
export const SESSION_PARTS_FROM_BANK = [
  'del-uppvarmning',
  'del-ovning',
  'del-spelovning',
  'del-spel',
] as const;
export type SessionPartFromBank = (typeof SESSION_PARTS_FROM_BANK)[number];

/** Avslutningen är ett fast inslag och får aldrig märkas på en övning. Källa: R-005, R-031. */
export const CLOSING_PART = 'del-avslutning';

/** Grupptyper. Källa: passuppbyggnad.md, R-008. */
export const GROUP_TYPES = ['fri', 'par', 'tva-lag', 'fast-storlek'] as const;
export type GroupType = (typeof GROUP_TYPES)[number];

/** Materialtyper, sluten lista. Källa: passuppbyggnad.md avsnitt *Material*, R-120. */
export const MATERIAL_TYPES = [
  'boll',
  'kon',
  'markering',
  'vast',
  'mal',
  'minimal',
  'hinder',
  'ovrigt',
] as const;
export type MaterialType = (typeof MATERIAL_TYPES)[number];

/** Materialtyp som kräver en anteckning. Källa: R-120. */
export const MATERIAL_TYPE_REQUIRING_NOTE = 'ovrigt';

/** Materialtyper som utlöser påminnelsen om förankrade mål. Källa: R-084, passuppbyggnad.md. */
export const MATERIAL_TYPES_WITH_GOAL: readonly MaterialType[] = ['mal', 'minimal'];

/** Fokusområden. Källa: docs/doman/fokusomraden.md, R-002. */
export const FOCUS_AREAS = [
  'bollkansla',
  'dribbling',
  'passning-mottagning',
  'avslut',
  'nickspel',
  'ett-mot-ett',
  'spelbarhet',
  'speluppbyggnad',
  'forsvarsspel',
  'omstallning',
  'fasta-situationer',
  'malvaktsspel',
  'koordination',
  'snabbhet',
  'uthallighet',
  'skadeforebyggande',
  'lek',
] as const;
export type FocusArea = (typeof FOCUS_AREAS)[number];

/** Fokusområdet nickning. Källa: R-080 till R-083, aldrar-och-fokus.md. */
export const FOCUS_AREA_HEADING = 'nickspel';

/** Lägsta ålder för nickspel. Källa: R-081, SvFF via aldrar-och-fokus.md. */
export const HEADING_MIN_AGE = 13;

/**
 * K = kärnområde, R = relevant, '-' = inte aktuellt för fasen.
 * Källa: fokusomraden.md, tabellen *Vilka fokusområden som gäller för vilka åldrar*, R-002.
 */
export type FocusRelevance = 'K' | 'R' | '-';

export const FOCUS_BY_PHASE: Record<FocusArea, Record<Phase, FocusRelevance>> = {
  bollkansla: {
    'fas-6-7': 'K',
    'fas-8-9': 'K',
    'fas-10-12': 'R',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  dribbling: {
    'fas-6-7': 'K',
    'fas-8-9': 'K',
    'fas-10-12': 'K',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  'passning-mottagning': {
    'fas-6-7': 'R',
    'fas-8-9': 'K',
    'fas-10-12': 'K',
    'fas-13-14': 'K',
    'fas-15-19': 'K',
  },
  avslut: { 'fas-6-7': 'K', 'fas-8-9': 'K', 'fas-10-12': 'K', 'fas-13-14': 'K', 'fas-15-19': 'K' },
  nickspel: {
    'fas-6-7': '-',
    'fas-8-9': '-',
    'fas-10-12': '-',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  'ett-mot-ett': {
    'fas-6-7': 'K',
    'fas-8-9': 'K',
    'fas-10-12': 'K',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  spelbarhet: {
    'fas-6-7': 'R',
    'fas-8-9': 'K',
    'fas-10-12': 'K',
    'fas-13-14': 'K',
    'fas-15-19': 'K',
  },
  speluppbyggnad: {
    'fas-6-7': '-',
    'fas-8-9': 'R',
    'fas-10-12': 'K',
    'fas-13-14': 'K',
    'fas-15-19': 'K',
  },
  forsvarsspel: {
    'fas-6-7': '-',
    'fas-8-9': 'R',
    'fas-10-12': 'K',
    'fas-13-14': 'K',
    'fas-15-19': 'K',
  },
  omstallning: {
    'fas-6-7': '-',
    'fas-8-9': 'R',
    'fas-10-12': 'K',
    'fas-13-14': 'K',
    'fas-15-19': 'K',
  },
  'fasta-situationer': {
    'fas-6-7': '-',
    'fas-8-9': '-',
    'fas-10-12': 'R',
    'fas-13-14': 'K',
    'fas-15-19': 'K',
  },
  malvaktsspel: {
    'fas-6-7': '-',
    'fas-8-9': 'R',
    'fas-10-12': 'R',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  koordination: {
    'fas-6-7': 'K',
    'fas-8-9': 'K',
    'fas-10-12': 'K',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  snabbhet: {
    'fas-6-7': 'R',
    'fas-8-9': 'R',
    'fas-10-12': 'R',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  uthallighet: {
    'fas-6-7': '-',
    'fas-8-9': '-',
    'fas-10-12': '-',
    'fas-13-14': 'R',
    'fas-15-19': 'R',
  },
  skadeforebyggande: {
    'fas-6-7': '-',
    'fas-8-9': 'R',
    'fas-10-12': 'R',
    'fas-13-14': 'K',
    'fas-15-19': 'K',
  },
  lek: { 'fas-6-7': 'K', 'fas-8-9': 'K', 'fas-10-12': 'R', 'fas-13-14': 'R', 'fas-15-19': 'R' },
};

/** Statusvärden för en fil i content/ovningar/. Källa: ADR 0010 avsnitt 4, content/ovningar/README.md. */
export const EXERCISE_STATUSES = ['utkast', 'granskad', 'atgarda', 'godkand'] as const;
export type ExerciseStatus = (typeof EXERCISE_STATUSES)[number];

/** Statusar som kräver att alla bankfält är ifyllda. Källa: ADR 0010 avsnitt 5. */
export const STATUSES_REQUIRING_BANK_FIELDS: readonly ExerciseStatus[] = ['granskad', 'godkand'];

/**
 * Fasen bestäms av åldern, aldrig av spelformen.
 *
 * @regel R-012
 */
export function phaseForAge(age: number): Phase | undefined {
  return PHASES.find((phase) => {
    const span = PHASE_AGES[phase];
    return age >= span.min && age <= span.max;
  });
}

/**
 * Alla faser som ett åldersspann berör.
 *
 * @regel R-002
 */
export function phasesForAgeSpan(minAge: number, maxAge: number): Phase[] {
  return PHASES.filter((phase) => {
    const span = PHASE_AGES[phase];
    return span.min <= maxAge && span.max >= minAge;
  });
}

/**
 * Spelformen som föreslås för en ålder.
 *
 * @regel R-013
 */
export function suggestedGameFormat(age: number): GameFormat | undefined {
  return GAME_FORMATS.find((format) => {
    const span = GAME_FORMAT_AGES[format];
    return age >= span.min && age <= span.max;
  });
}

/**
 * Den föreslagna spelformen och dess närmaste grannar i ordningen.
 *
 * @regel R-014
 */
export function allowedGameFormats(age: number): GameFormat[] {
  const suggested = suggestedGameFormat(age);
  if (suggested === undefined) {
    return [];
  }
  const index = GAME_FORMATS.indexOf(suggested);
  return GAME_FORMATS.slice(Math.max(0, index - 1), index + 2);
}

/**
 * Är fokusområdet K eller R för fasen?
 *
 * @regel R-002
 * @regel R-027
 */
export function isFocusAreaRelevant(focus: FocusArea, phase: Phase): boolean {
  return FOCUS_BY_PHASE[focus][phase] !== '-';
}

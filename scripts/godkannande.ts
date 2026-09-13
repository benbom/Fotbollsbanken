/**
 * Kontrollen `godkannande` och skrivningen av `status: godkand` (ADR 0013).
 *
 *   npm run godkannande -- kontroll --bas <sha> --huvud <sha>
 *   npm run godkannande -- godkann --fore <sha> --efter <sha> [--av <konto>] [--pr <nr>] [--skriv]
 *
 * `kontroll` underkänner en pull request som sätter `godkand` på en övning, och en omgång som
 * samtidigt ändrar filer utanför `content/` och `docs/` (ADR 0013 avsnitt 3, lager 3).
 *
 * `godkann` sätter `godkand` på de granskade övningarna i en mergad omgång. Utan `--skriv`
 * ändras ingenting: skriptet visar bara vad det skulle göra, så att det går att pröva lokalt.
 *
 * Skriptet läser båda revisionerna ur git, aldrig ur arbetskatalogen. Då kan arbetsflödet checka
 * ut basgrenens kod och ändå läsa pull requestens innehåll utan att köra det (S-03).
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isSeq, parse, parseDocument } from 'yaml';
import type { ExerciseStatus } from '../src/regelmotor/keys.ts';

/** Mappen med övningsbanken, relativt repots rot. Samma som i valideringsskriptet. */
export const CONTENT_DIR = 'content/ovningar';

/** Statusen som bara arbetsflödet `godkann-omgang` får skriva (ADR 0010 avsnitt 1, ADR 0013). */
export const APPROVED_STATUS: ExerciseStatus = 'godkand';

/** Statusen fotbollsexperten sätter. Den enda status som `godkann-omgang` lyfter. */
export const REVIEWED_STATUS: ExerciseStatus = 'granskad';

/**
 * Sökvägar en omgång får röra. En pull request som ändrar övningar får inte i samma svep ändra
 * kod, arbetsflöden eller beroenden: mergen släpper fram just den koden till arbetsflödet som
 * sedan kör med `contents: write` (S-03, ADR 0013 avsnitt 3).
 */
export const PREFIXES_ALLOWED_WITH_EXERCISES = ['content/', 'docs/'] as const;

/** Rollen som skrivs i granskningsraden. `granskning.roll` är fri text i schemat. */
const APPROVAL_ROLE = 'redaktör';

/** En commit som inte finns, till exempel `github.event.before` för en ny gren. */
const EMPTY_SHA = '0000000000000000000000000000000000000000';

/** Läsning ur git. Allt skriptet behöver av repot, så att testerna slipper ett riktigt repo. */
export interface GitReader {
  /** Filer som skiljer sig mellan två revisioner, som sökvägar relativt repots rot. */
  changedFiles(from: string, to: string): string[];
  /** Filens innehåll vid en revision, eller `undefined` om filen inte finns där. */
  read(rev: string, path: string): string | undefined;
  /** Den gemensamma grenpunkten, alltså den commit grenen utgick från. */
  mergeBase(a: string, b: string): string;
}

export function createGitReader(cwd: string = process.cwd()): GitReader {
  // stderr fångas i stället för att skrivas ut: `read` frågar med flit efter filer som kan
  // saknas i en revision, och de svaren är inga fel. Går något annat fel följer git:s eget
  // meddelande med i undantaget.
  const git = (args: string[]): string => {
    try {
      return execFileSync('git', args, {
        cwd,
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (cause) {
      const stderr = ((cause as { stderr?: string }).stderr ?? '').trim();
      throw new Error(
        `git ${args.join(' ')}: ${stderr === '' ? (cause as Error).message : stderr}`,
        {
          cause,
        },
      );
    }
  };

  return {
    // --no-renames: ett namnbyte ska synas som borttagen och tillagd fil, så att en godkänd
    // övning som byter namn räknas som ny och fångas av kontrollen.
    changedFiles: (from, to) =>
      git(['diff', '--name-only', '--no-renames', from, to])
        .split('\n')
        .filter((line) => line !== ''),
    read: (rev, path) => {
      try {
        return git(['show', `${rev}:${path}`]);
      } catch {
        return undefined;
      }
    },
    mergeBase: (a, b) => git(['merge-base', a, b]).trim(),
  };
}

/** Övningsfiler: `.yaml` direkt i `content/ovningar/`, utom de som börjar med `_` (ADR 0010). */
export function isExerciseFile(path: string): boolean {
  if (!path.startsWith(`${CONTENT_DIR}/`)) {
    return false;
  }
  const rest = path.slice(CONTENT_DIR.length + 1);
  return rest !== '' && !rest.includes('/') && rest.endsWith('.yaml') && !rest.startsWith('_');
}

export interface StatusReading {
  status?: string;
  /** Satt när filen inte går att läsa. Kontrollen fäller då filen i stället för att gissa. */
  error?: string;
}

/** Läser `status` ur en övningsfil utan att bry sig om resten. */
export function readStatus(text: string): StatusReading {
  let document: unknown;
  try {
    document = parse(text);
  } catch (cause) {
    return { error: `går inte att läsa som YAML: ${(cause as Error).message}` };
  }

  if (document === null || typeof document !== 'object' || Array.isArray(document)) {
    return { error: 'filen innehåller ingen övning som ett YAML-objekt' };
  }

  const status = (document as { status?: unknown }).status;
  if (status === undefined) {
    return {};
  }
  if (typeof status !== 'string') {
    return { error: 'status är inte en text' };
  }
  return { status };
}

/** Basename används bara för utskrifter; sökvägen i git är alltid hela sökvägen. */
export function fileName(path: string): string {
  return basename(path);
}

/** Ett skäl att underkänna. `file` är tom sträng när fyndet gäller hela omgången. */
export interface Finding {
  file: string;
  message: string;
}

export interface CheckOptions {
  /** Basgrenens commit, alltså `main` som pull requesten riktas mot. */
  base: string;
  /** Pull requestens översta commit. */
  head: string;
}

export interface CheckResult {
  ok: boolean;
  findings: Finding[];
  /** Ändrade övningsfiler, och ändrade filer utanför banken. Båda bara för utskriften. */
  exercises: string[];
  others: string[];
}

/** En rad per fynd: `fil: meddelande`, eller bara meddelandet när fyndet gäller omgången. */
export function formatFinding(finding: Finding): string {
  return finding.file === '' ? finding.message : `${finding.file}: ${finding.message}`;
}

function isAllowedWithExercises(path: string): boolean {
  return PREFIXES_ALLOWED_WITH_EXERCISES.some((prefix) => path.startsWith(prefix));
}

/**
 * Kontrollen `godkannande` (ADR 0013 avsnitt 3, lager 3). Underkänner två saker, utan undantag
 * för vem som skrev commiten:
 *
 * 1. en övningsfil som går från något annat till `status: godkand`,
 * 2. en omgång som samtidigt ändrar filer utanför `content/` och `docs/`.
 *
 * Jämförelsen utgår från grenpunkten, så att commits som kommit till på `main` under tiden
 * inte räknas som pull requestens ändringar.
 */
export function kontroll(git: GitReader, options: CheckOptions): CheckResult {
  const from = git.mergeBase(options.base, options.head);
  const changed = git.changedFiles(from, options.head);
  const exercises = changed.filter(isExerciseFile);
  const others = changed.filter((path) => !isExerciseFile(path));
  const findings: Finding[] = [];

  for (const path of exercises) {
    const after = git.read(options.head, path);
    if (after === undefined) {
      continue; // Filen är borttagen i pull requesten och kan inte sätta någon status.
    }

    const reading = readStatus(after);
    if (reading.error !== undefined) {
      findings.push({ file: path, message: reading.error });
      continue;
    }
    if (reading.status !== APPROVED_STATUS) {
      continue;
    }

    // En fil som redan stod i `godkand` före pull requesten får ändras. Det är övergången till
    // `godkand` som bara arbetsflödet får göra, och en ny fil har ingen tidigare status.
    const before = git.read(from, path);
    const wasApproved = before !== undefined && readStatus(before).status === APPROVED_STATUS;
    if (!wasApproved) {
      findings.push({
        file: path,
        message:
          `sätter status: ${APPROVED_STATUS}. Värdet skrivs bara av arbetsflödet ` +
          'godkann-omgang, efter att omgången mergats till main (ADR 0013 avsnitt 2)',
      });
    }
  }

  if (exercises.length > 0) {
    for (const path of others.filter((candidate) => !isAllowedWithExercises(candidate))) {
      findings.push({
        file: path,
        message:
          'ändras i samma pull request som en övning. En omgång får bara röra ' +
          `${PREFIXES_ALLOWED_WITH_EXERCISES.join(' och ')} (ADR 0013 avsnitt 3, S-03)`,
      });
    }
  }

  return { ok: findings.length === 0, findings, exercises, others };
}

/** Raden som skrivs in i `granskning` när en övning lyfts. Samma form som schemats poster. */
export interface ReviewLine {
  datum: string;
  av: string;
  roll: string;
  kommentar?: string;
}

export interface ApprovalOptions {
  /** Commiten före mergen, `github.event.before`. */
  before: string;
  /** Commiten mergen lade på `main`, `github.sha`. */
  after: string;
  /** Kontot som mergade, `pull_request.merged_by`. */
  av: string;
  /** Pull requestens nummer, om det är känt. */
  pr?: number;
  /** Dagens datum som ÅÅÅÅ-MM-DD. Går att sätta, så att testerna blir förutsägbara. */
  datum?: string;
  /** Utan detta ändras ingen fil: skriptet visar bara vad det skulle göra. */
  write?: boolean;
}

export type ApprovalOutcome = 'lyft' | 'orord' | 'fel';

export interface ApprovalFile {
  file: string;
  outcome: ApprovalOutcome;
  message: string;
  /** Filens nya innehåll. Satt bara för `lyft`, också vid torrkörning. */
  text?: string;
}

export interface ApprovalResult {
  ok: boolean;
  files: ApprovalFile[];
  /** Sant när filerna skrevs till disk. Falskt vid torrkörning. */
  written: boolean;
}

/** Granskningsraden som godkännandet lämnar efter sig. */
export function reviewLine(options: ApprovalOptions): ReviewLine {
  const datum = options.datum ?? new Date().toISOString().slice(0, 10);
  const kommentar =
    options.pr === undefined
      ? 'Godkänd genom merge till main.'
      : `Godkänd genom merge av pull request #${options.pr}.`;
  return { datum, av: options.av, roll: APPROVAL_ROLE, kommentar };
}

/**
 * Radbredden som återger filen ordagrant. Skriptet ska bara ändra `status` och `granskning`,
 * så det väljer den bredd som gör en oförändrad fil identisk med sig själv och rör därmed
 * inte hur resten av texten är radbruten.
 */
function chooseLineWidth(raw: string): number {
  for (const lineWidth of [100, 0, 80]) {
    try {
      if (parseDocument(raw).toString({ lineWidth }) === raw) {
        return lineWidth;
      }
    } catch {
      break;
    }
  }
  return 100;
}

/**
 * Sant när den nya texten skiljer sig från den gamla på exakt två sätt: `status` är höjd, och
 * granskningsraden ligger sist i `granskning`. Allt annat, varje övrigt fält och varje tidigare
 * granskningsrad, ska vara oförändrat. Skriptet skriver aldrig text (ADR 0013 avsnitt 3).
 */
function changesOnlyStatusAndReview(raw: string, text: string, entry: ReviewLine): boolean {
  const split = (source: string): { rest: string; reviews: string } => {
    const document = parse(source) as Record<string, unknown>;
    const { status: _status, granskning: reviews, ...rest } = document;
    return { rest: JSON.stringify(rest), reviews: JSON.stringify(reviews ?? []) };
  };

  try {
    const before = split(raw);
    const after = split(text);
    const expected = JSON.stringify([...(JSON.parse(before.reviews) as unknown[]), entry]);
    return after.rest === before.rest && after.reviews === expected;
  } catch {
    return false;
  }
}

/**
 * Lyfter en granskad övning till `godkand` och lägger till granskningsraden. Returnerar filens
 * nya text, eller ett fel. Allt annat i filen ska vara ordagrant oförändrat; är det inte det
 * lämnas filen orörd (ADR 0013 avsnitt 3, lager 4: skriptet skriver aldrig text).
 */
export function raiseToApproved(
  raw: string,
  entry: ReviewLine,
): { text: string } | { error: string } {
  const document = parseDocument(raw);
  if (document.errors.length > 0) {
    return { error: `går inte att läsa som YAML: ${document.errors[0]?.message ?? ''}` };
  }
  if (document.get('status') !== REVIEWED_STATUS) {
    return { error: `status är inte ${REVIEWED_STATUS}` };
  }

  const reviews = document.get('granskning', true);
  if (!isSeq(reviews)) {
    return { error: 'granskning är ingen lista' };
  }

  const lineWidth = chooseLineWidth(raw);
  document.set('status', APPROVED_STATUS);
  // En tom lista skrivs som `granskning: []`. Raden ska ändå ligga som ett block, som i banken.
  reviews.flow = false;
  reviews.add(document.createNode(entry));
  const text = document.toString({ lineWidth });

  if (!changesOnlyStatusAndReview(raw, text, entry)) {
    return { error: 'skrivningen skulle ändra mer än status och granskningsraden' };
  }
  return { text };
}

/** Skrivning av en fil. Testerna skickar in sin egen, så att inget hamnar på disk. */
export type WriteFile = (path: string, text: string) => void;

const writeToDisk: WriteFile = (path, text) => writeFileSync(path, text, 'utf8');

/**
 * Sätter `godkand` på de granskade övningarna i en mergad omgång (ADR 0013 avsnitt 4).
 * Filer i `utkast`, `atgarda` eller redan `godkand` lämnas orörda, så att en omkörning är
 * ofarlig. Utan `options.write` skrivs ingenting.
 */
export function godkann(
  git: GitReader,
  options: ApprovalOptions,
  writeFile: WriteFile = writeToDisk,
): ApprovalResult {
  const entry = reviewLine(options);
  const files: ApprovalFile[] = [];

  for (const path of git.changedFiles(options.before, options.after).filter(isExerciseFile)) {
    const raw = git.read(options.after, path);
    if (raw === undefined) {
      files.push({ file: path, outcome: 'orord', message: 'borttagen i omgången' });
      continue;
    }

    const reading = readStatus(raw);
    if (reading.error !== undefined) {
      files.push({ file: path, outcome: 'fel', message: reading.error });
      continue;
    }
    if (reading.status !== REVIEWED_STATUS) {
      files.push({
        file: path,
        outcome: 'orord',
        message: `status är ${reading.status ?? 'inte satt'}`,
      });
      continue;
    }

    const raised = raiseToApproved(raw, entry);
    if ('error' in raised) {
      files.push({ file: path, outcome: 'fel', message: raised.error });
      continue;
    }

    if (options.write === true) {
      writeFile(path, raised.text);
    }
    files.push({
      file: path,
      outcome: 'lyft',
      message: `${REVIEWED_STATUS} → ${APPROVED_STATUS}`,
      text: raised.text,
    });
  }

  return {
    ok: files.every((file) => file.outcome !== 'fel'),
    files,
    written: options.write === true,
  };
}

const COMMANDS = ['kontroll', 'godkann'] as const;
type Command = (typeof COMMANDS)[number];

const VALUE_FLAGS = ['--bas', '--huvud', '--fore', '--efter', '--av', '--pr'] as const;

export interface ParsedArguments {
  command: Command;
  values: Map<string, string>;
  write: boolean;
}

/** Argumenten: ett kommando, `--flagga värde` och den ensamma flaggan `--skriv`. */
export function parseArguments(argv: string[]): ParsedArguments | { error: string } {
  const [command, ...rest] = argv;
  if (command === undefined || !COMMANDS.includes(command as Command)) {
    return { error: `Ange ett kommando: ${COMMANDS.join(' eller ')}.` };
  }

  const values = new Map<string, string>();
  let write = false;

  for (let index = 0; index < rest.length; index += 1) {
    const flag = rest[index] as string;
    if (flag === '--skriv') {
      write = true;
      continue;
    }
    if (!VALUE_FLAGS.includes(flag as (typeof VALUE_FLAGS)[number])) {
      return { error: `Okänd flagga: ${flag}.` };
    }
    const value = rest[index + 1];
    if (value === undefined || value.startsWith('--')) {
      return { error: `Flaggan ${flag} saknar värde.` };
    }
    values.set(flag, value);
    index += 1;
  }

  return { command: command as Command, values, write };
}

/** `1 övning` men `2 övningar`, så att utskriften går att läsa. */
function antal(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function runKontroll(git: GitReader, args: ParsedArguments, log: (line: string) => void): number {
  const base = args.values.get('--bas');
  const head = args.values.get('--huvud');
  if (base === undefined || head === undefined) {
    log('Ange --bas <sha> och --huvud <sha>.');
    return 1;
  }

  const result = kontroll(git, { base, head });
  log(
    `Omgången ändrar ${antal(result.exercises.length, 'övning', 'övningar')} och ` +
      `${antal(result.others.length, 'annan fil', 'andra filer')}.`,
  );
  for (const finding of result.findings) {
    log(formatFinding(finding));
  }
  log(result.ok ? 'Kontrollen godkänner omgången.' : `Kontrollen underkänner omgången.`);
  return result.ok ? 0 : 1;
}

function runGodkann(git: GitReader, args: ParsedArguments, log: (line: string) => void): number {
  const before = args.values.get('--fore');
  const after = args.values.get('--efter');
  if (before === undefined || after === undefined) {
    log('Ange --fore <sha> och --efter <sha>.');
    return 1;
  }
  if (before === EMPTY_SHA) {
    log(`Ingen tidigare commit (${EMPTY_SHA}). Ingenting skrivs.`);
    return 0;
  }

  const pr = args.values.get('--pr');
  if (pr !== undefined && !/^\d+$/.test(pr)) {
    log('Flaggan --pr ska vara ett nummer.');
    return 1;
  }

  const av = args.values.get('--av');
  if (args.write && av === undefined) {
    log('Ange --av <konto>, det konto som mergade omgången. Utan det skrivs ingenting.');
    return 1;
  }

  const result = godkann(git, {
    before,
    after,
    av: av ?? 'okänt konto',
    pr: pr === undefined ? undefined : Number(pr),
    write: args.write,
  });

  for (const file of result.files) {
    log(
      `${file.outcome === 'lyft' ? 'Lyfter' : file.outcome === 'orord' ? 'Rör inte' : 'Fel i'} ${fileName(file.file)}: ${file.message}`,
    );
  }

  const raised = result.files.filter((file) => file.outcome === 'lyft').length;
  log(
    result.written
      ? `${antal(raised, 'övning satt', 'övningar satta')} till ${APPROVED_STATUS}.`
      : `Torrkörning: ${antal(raised, 'övning', 'övningar')} skulle sättas till ` +
          `${APPROVED_STATUS}. Lägg till --skriv för att skriva.`,
  );
  return result.ok ? 0 : 1;
}

/** Kör skriptet. Returnerar processens slutkod: 1 om något underkänns. */
export function main(
  argv: string[],
  log: (line: string) => void = console.log,
  git: GitReader = createGitReader(),
): number {
  const args = parseArguments(argv);
  if ('error' in args) {
    log(args.error);
    return 1;
  }
  return args.command === 'kontroll' ? runKontroll(git, args, log) : runGodkann(git, args, log);
}

const invokedDirectly =
  process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  process.exitCode = main(process.argv.slice(2));
}

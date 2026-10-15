/**
 * Case-study listing filter — pure, so it is unit-tested and the page script
 * only wires it to the DOM. Matching is case- and accent-insensitive and needs
 * every query word to appear ("etude client" matches "Étude … clients").
 */
export interface FilterableStudy {
  slug: string;
  sector: string;
  /** Searchable text: title and summary, already folded with `fold()`. */
  text: string;
}

export interface StudyFilter {
  q?: string | null;
  sector?: string | null;
}

/** Lower-case and strip diacritics, so "É" matches "e". */
export const fold = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/**
 * Normalise a filter from untrusted input (the URL): trims the query and drops
 * a sector that does not exist, so a stale or hand-edited link can never blank
 * the page.
 */
export function cleanFilter(f: StudyFilter, sectors: readonly string[]): { q: string; sector: string | null } {
  const q = (f.q ?? '').trim().replace(/\s+/g, ' ').slice(0, 100);
  const sector = f.sector && sectors.includes(f.sector) ? f.sector : null;
  return { q, sector };
}

/** Slugs of the studies that match, in input order. */
export function filterStudies(list: FilterableStudy[], f: StudyFilter, sectors: readonly string[]): string[] {
  const { q, sector } = cleanFilter(f, sectors);
  const words = fold(q).split(' ').filter(Boolean);
  return list.filter((s) => (!sector || s.sector === sector) && words.every((w) => s.text.includes(w))).map((s) => s.slug);
}

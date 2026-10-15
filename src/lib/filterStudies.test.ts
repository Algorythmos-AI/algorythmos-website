import { describe, it, expect } from 'vitest';
import { filterStudies, cleanFilter, fold, type FilterableStudy } from './filterStudies';

const SECTORS = ['healthcare', 'retail'] as const;
const list: FilterableStudy[] = [
  { slug: 'a', sector: 'healthcare', text: fold('Étude clinique — document AI') },
  { slug: 'b', sector: 'retail', text: fold('Retail SQL analytics') },
  { slug: 'c', sector: 'healthcare', text: fold('Healthcare MLOps platform') },
];

describe('filterStudies', () => {
  it('returns everything for an empty filter', () => {
    expect(filterStudies(list, {}, SECTORS)).toEqual(['a', 'b', 'c']);
    expect(filterStudies(list, { q: '   ' }, SECTORS)).toEqual(['a', 'b', 'c']);
  });
  it('ignores case and accents', () => {
    expect(filterStudies(list, { q: 'ETUDE' }, SECTORS)).toEqual(['a']);
    expect(filterStudies(list, { q: 'étude' }, SECTORS)).toEqual(['a']);
  });
  it('needs every word, in any order', () => {
    expect(filterStudies(list, { q: 'platform healthcare' }, SECTORS)).toEqual(['c']);
    expect(filterStudies(list, { q: 'healthcare retail' }, SECTORS)).toEqual([]);
  });
  it('collapses extra whitespace', () => {
    expect(filterStudies(list, { q: '  retail    sql ' }, SECTORS)).toEqual(['b']);
  });
  it('filters by sector and combines with the query', () => {
    expect(filterStudies(list, { sector: 'healthcare' }, SECTORS)).toEqual(['a', 'c']);
    expect(filterStudies(list, { sector: 'healthcare', q: 'mlops' }, SECTORS)).toEqual(['c']);
  });
  it('ignores an unknown sector instead of blanking the page', () => {
    expect(filterStudies(list, { sector: 'nope' }, SECTORS)).toEqual(['a', 'b', 'c']);
    expect(cleanFilter({ sector: 'nope' }, SECTORS).sector).toBeNull();
  });
  it('caps an absurdly long query', () => {
    expect(cleanFilter({ q: 'x'.repeat(500) }, SECTORS).q).toHaveLength(100);
  });
});

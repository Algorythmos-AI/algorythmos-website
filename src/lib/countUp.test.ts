import { describe, it, expect } from 'vitest';
import { formatCountable, parseCountable } from './countUp';
import en from '../i18n/ui/en.global.json';
import fr from '../i18n/ui/fr.fr.json';

describe('parseCountable', () => {
  it.each([
    ['99.2%', { prefix: '', value: 99.2, decimals: 1, mark: '.', suffix: '%' }],
    ['40%', { prefix: '', value: 40, decimals: 0, mark: '.', suffix: '%' }],
    ['99,6 %', { prefix: '', value: 99.6, decimals: 1, mark: ',', suffix: ' %' }],
    ['3×', { prefix: '', value: 3, decimals: 0, mark: '.', suffix: '×' }],
    ['1,284', { prefix: '', value: 1284, decimals: 0, mark: '.', suffix: '' }],
    ['1 284', { prefix: '', value: 1284, decimals: 0, mark: '.', suffix: '' }],
    ['+12 pts', { prefix: '+', value: 12, decimals: 0, mark: '.', suffix: ' pts' }],
    ['<5%', { prefix: '<', value: 5, decimals: 0, mark: '.', suffix: '%' }],
  ])('%s', (text, expected) => {
    expect(parseCountable(text)).toEqual(expected);
  });

  it.each(['Minutes', 'Live', 'One', 'Days → minutes', '2.8M TEU', '24/7', 'A$ 99', '3–5 days', '', '0%', '1.2.3'])(
    'leaves "%s" alone',
    (text) => {
      expect(parseCountable(text)).toBeNull();
    },
  );
});

describe('formatCountable', () => {
  it('ends on the figure it was given, in the shape the copy used', () => {
    for (const text of ['99.2%', '99,6 %', '40%', '3×', '+12 pts']) {
      expect(formatCountable(parseCountable(text)!, 1)).toBe(text);
    }
  });

  it('starts from zero with the same number of decimals, so the width barely changes', () => {
    expect(formatCountable(parseCountable('99.2%')!, 0)).toBe('0.0%');
    expect(formatCountable(parseCountable('99,6 %')!, 0.5)).toBe('49,8 %');
  });

  it('clamps progress', () => {
    const c = parseCountable('40%')!;
    expect(formatCountable(c, -1)).toBe('0%');
    expect(formatCountable(c, 2)).toBe('40%');
  });
});

describe('every case-study stat in the dictionaries', () => {
  /* Whatever the copy says, a count-up must end on exactly that string — and a
     value that is not a plain figure must be refused, not mangled. */
  const stats = (dict: Record<string, string>) =>
    Object.entries(dict).filter(([k]) => /^caseStudyDetail\.studies\..+\.stats\.\d+\.value$/.test(k));

  it.each([
    ['en', en as Record<string, string>],
    ['fr', fr as Record<string, string>],
  ])('%s', (_name, dict) => {
    const all = stats(dict);
    expect(all.length).toBeGreaterThan(10);
    for (const [key, value] of all) {
      const parsed = parseCountable(value);
      if (parsed) expect(formatCountable(parsed, 1), key).toBe(value.trim());
      else expect(/^[+\-−~≈<>$€£]?\s?\d+([.,]\d+)?\s?%?$/.test(value.trim()), `${key} = "${value}" looks countable but was refused`).toBe(false);
    }
  });
});

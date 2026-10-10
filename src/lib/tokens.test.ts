import { describe, it, expect } from 'vitest';
import { parseChannels } from './tokens';

describe('parseChannels', () => {
  it('reads the space-separated channel form the theme tokens use', () => {
    expect(parseChannels('167 139 250')).toEqual({ r: 167, g: 139, b: 250 });
    expect(parseChannels('  34 211 238 ')).toEqual({ r: 34, g: 211, b: 238 });
  });

  it('accepts comma-separated channels', () => {
    expect(parseChannels('109, 40, 217')).toEqual({ r: 109, g: 40, b: 217 });
  });

  it('rejects anything that is not a channel triplet, so the caller keeps its fallback', () => {
    expect(parseChannels('')).toBeNull();
    expect(parseChannels('#a78bfa')).toBeNull();
    expect(parseChannels('rgb(1 2 3)')).toBeNull();
    expect(parseChannels('12 34')).toBeNull();
  });
});

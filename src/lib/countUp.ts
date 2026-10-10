/**
 * Count a figure up from zero when it scrolls into view.
 *
 * Stat values are copy, written by hand in two languages ("99.2%", "99,6 %",
 * "40%", "3×"), and plenty of them are not numbers at all ("Minutes", "Live",
 * "Days → minutes", "2.8M TEU"). `parseCountable` accepts only a single plain
 * number with an optional short unit, and returns null for everything else, so
 * those are left exactly as written. The last frame always restores the original
 * string, so whatever formatting the copy used is what the reader ends on.
 */
export interface Countable {
  prefix: string;
  value: number;
  decimals: number;
  /** The decimal mark the copy used: "." or ",". */
  mark: '.' | ',';
  suffix: string;
}

/* An optional sign or currency mark, a number, then at most a short unit: %, ×, x, +, k, pts. */
const SHAPE = /^([+\-−~≈<>$€£]{0,2}\s?)(\d{1,3}(?:[\s  ,.]\d{3})*(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)(\s?(?:%|×|x|\+|k|pts?|pt)?)$/i;

export function parseCountable(text: string): Countable | null {
  const m = SHAPE.exec(text.trim());
  if (!m) return null;
  const [, prefix, digits, suffix] = m;
  /* A trailing ",dd" or ".dd" is a decimal part; any other separator groups thousands. */
  const dec = /[.,](\d{1,2})$/.exec(digits);
  const decimals = dec ? dec[1].length : 0;
  const mark: '.' | ',' = dec && digits[digits.length - decimals - 1] === ',' ? ',' : '.';
  const whole = (dec ? digits.slice(0, -decimals - 1) : digits).replace(/[\s  ,.]/g, '');
  const value = Number(dec ? `${whole}.${dec[1]}` : whole);
  if (!Number.isFinite(value) || value === 0) return null;
  return { prefix, value, decimals, mark, suffix };
}

/** The figure at progress p (0…1), in the shape the copy used. */
export function formatCountable(c: Countable, p: number): string {
  const n = (c.value * Math.min(1, Math.max(0, p))).toFixed(c.decimals);
  return `${c.prefix}${c.mark === ',' ? n.replace('.', ',') : n}${c.suffix}`;
}

const DURATION = 1400;
const easeOutQuart = (p: number) => 1 - Math.pow(1 - p, 4);

/**
 * Arm every `[data-countup]` under `root`: when one scrolls into view it counts up
 * to the figure it already shows. Returns a teardown. Call with motion allowed;
 * the caller checks `motionOff()`.
 */
export function armCountUps(root: ParentNode = document): () => void {
  const els = [...root.querySelectorAll<HTMLElement>('[data-countup]:not([data-countup-armed])')];
  const frames = new Set<number>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        const el = entry.target as HTMLElement;
        const final = el.textContent ?? '';
        const parsed = parseCountable(final);
        if (!parsed) continue;
        /* Hold the width of the final figure so the row does not jitter while it counts. */
        el.style.minWidth = `${el.getBoundingClientRect().width}px`;
        let start = 0;
        const step = (now: number) => {
          if (!start) start = now;
          const p = Math.min((now - start) / DURATION, 1);
          if (p < 1) {
            el.textContent = formatCountable(parsed, easeOutQuart(p));
            frames.add(requestAnimationFrame(step));
          } else {
            el.textContent = final;
            el.style.minWidth = '';
          }
        };
        frames.add(requestAnimationFrame(step));
      }
    },
    { threshold: 0.4 },
  );
  for (const el of els) {
    el.dataset.countupArmed = '1';
    io.observe(el);
  }
  return () => {
    io.disconnect();
    frames.forEach((id) => cancelAnimationFrame(id));
  };
}

import { useId, useState } from 'react';
import { bitGain, CELL_RATIO, dieAreaRatio } from '@/lib/densityModel';

export interface DensityCalculatorLabels {
  title: string;
  caption: string;
  slider: string;
  before: string;
  after: string;
  array: string;
  periphery: string;
  area: string;
  gain: string;
}

interface Props {
  labels: DensityCalculatorLabels;
  /** BCP 47 tag for number formatting. */
  locale: string;
  /** Array share of the die the figure opens on, in per cent. */
  initial?: number;
}

const MIN = 30;
const MAX = 90;

/**
 * The whole-die model from the DRAM report, with the array share as a slider.
 * Server-rendered at `initial`, so the figure and its numbers read correctly
 * before any script runs and with scripting off.
 */
export default function DensityCalculator({ labels, locale, initial = 60 }: Props) {
  const [share, setShare] = useState(initial);
  const id = useId();
  const p = share / 100;
  const pct = (x: number, digits = 0) =>
    new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(x);
  /* Widths as percentages of the original die. */
  const arrayNow = p * CELL_RATIO * 100;
  const rest = (1 - p) * 100;

  const bar = (arrayWidth: number) => (
    <div className="flex h-10 w-full overflow-hidden rounded-lg border border-line bg-surface-2/40">
      <div className="h-full bg-brand/70 transition-[width] duration-300 ease-out motion-reduce:transition-none" style={{ width: `${arrayWidth}%` }} />
      <div className="h-full border-l border-line bg-ink-subtle/30 transition-[width] duration-300 ease-out motion-reduce:transition-none" style={{ width: `${rest}%` }} />
    </div>
  );

  return (
    <figure className="rounded-2xl border border-line glass p-4 sm:p-6" data-density-calculator aria-labelledby={`${id}-title`}>
      <figcaption>
        <h3 id={`${id}-title`} className="text-base font-semibold text-ink">
          {labels.title}
        </h3>
        <p className="mt-1 text-sm text-ink-muted">{labels.caption}</p>
      </figcaption>

      <div className="mt-5 grid items-start gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-4 rounded-xl border border-line/70 bg-surface-2/40 p-4" aria-hidden="true">
          <div>
            <p className="mb-1.5 text-xs font-medium text-ink-muted">{labels.before}</p>
            {bar(share)}
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-ink-muted">{labels.after}</p>
            {bar(arrayNow)}
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted">
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-brand/70" />
              {labels.array}
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-sm bg-ink-subtle/30" />
              {labels.periphery}
            </li>
          </ul>
        </div>

        <div>
          <label htmlFor={`${id}-share`} className="flex items-baseline justify-between gap-3 text-sm font-medium text-ink">
            <span>{labels.slider}</span>
            <output htmlFor={`${id}-share`} className="tabular-nums text-brand" data-density-share>
              {pct(p)}
            </output>
          </label>
          <input
            id={`${id}-share`}
            type="range"
            min={MIN}
            max={MAX}
            step={5}
            value={share}
            onChange={(e) => setShare(Number(e.currentTarget.value))}
            className="mt-3 w-full accent-brand"
          />
          <dl className="mt-5 grid grid-cols-2 gap-3" aria-live="polite">
            <div className="rounded-xl border border-line glass p-4">
              <dd className="text-gradient-brand text-2xl font-bold tabular-nums" data-density-area>
                {pct(dieAreaRatio(p), 1)}
              </dd>
              <dt className="mt-1 text-xs text-ink-muted">{labels.area}</dt>
            </div>
            <div className="rounded-xl border border-line glass p-4">
              <dd className="text-gradient-brand text-2xl font-bold tabular-nums" data-density-gain>
                +{pct(bitGain(p), 1)}
              </dd>
              <dt className="mt-1 text-xs text-ink-muted">{labels.gain}</dt>
            </div>
          </dl>
        </div>
      </div>
    </figure>
  );
}

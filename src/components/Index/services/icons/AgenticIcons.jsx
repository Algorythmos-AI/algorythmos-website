import React from "react";

/** Decorative SVGs for the Agentic capabilities grid (48x48). All colors use gradients, outlines use currentColor so you can override via Tailwind if needed. */

export function MemoryLensIcon({ className = "w-10 h-10" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="memGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      <circle cx="22" cy="22" r="14" fill="url(#memGrad)" opacity="0.18" />
      <circle cx="22" cy="22" r="9" fill="none" stroke="url(#memGrad)" strokeWidth="2" />
      <path d="M30 30 L42 42" stroke="url(#memGrad)" strokeWidth="3" strokeLinecap="round" />
      {/* memory swirl */}
      <path d="M16 22c0-3 2.5-5.5 5.5-5.5S27 19 27 22" fill="none" stroke="url(#memGrad)" strokeWidth="2" />
      <path d="M17 24c.8 2.4 3 4 5.5 4 2.7 0 5-1.9 5.5-4.5" fill="none" stroke="url(#memGrad)" strokeWidth="2" opacity=".8" />
      {/* nodes */}
      <circle cx="18" cy="18" r="1.6" fill="#A7F3D0" />
      <circle cx="25.5" cy="18.5" r="1.6" fill="#A7F3D0" />
      <circle cx="22" cy="26" r="1.6" fill="#A7F3D0" />
    </svg>
  );
}

export function TransformSparkIcon({ className = "w-10 h-10" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="wandGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      {/* wand */}
      <rect x="10" y="28" width="20" height="4" rx="2" fill="url(#wandGrad)" />
      <rect x="28" y="20" width="10" height="4" rx="2" transform="rotate(45 28 20)" fill="#93C5FD" />
      {/* stars */}
      <path d="M34 10l1.2 2.6 2.8.4-2.1 2 0.5 2.8L34 17l-2.4 1.8 0.5-2.8-2.1-2 2.8-.4z" fill="#C4B5FD" />
      <path d="M26 14l.8 1.8 2 .3-1.5 1.4.4 2-1.7-1.1-1.7 1.1.4-2-1.5-1.4 2-.3z" fill="#BFDBFE" />
      {/* data bars */}
      <rect x="6" y="10" width="4" height="10" rx="1.5" fill="url(#wandGrad)" opacity=".7" />
      <rect x="12" y="12" width="4" height="8" rx="1.5" fill="url(#wandGrad)" opacity=".5" />
      <rect x="18" y="8" width="4" height="12" rx="1.5" fill="url(#wandGrad)" opacity=".85" />
    </svg>
  );
}

export function ShieldRingsIcon({ className = "w-10 h-10" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
      </defs>
      {/* outer rings */}
      <circle cx="24" cy="24" r="17" fill="none" stroke="url(#shieldGrad)" strokeWidth="2" opacity=".3" />
      <circle cx="24" cy="24" r="13" fill="none" stroke="url(#shieldGrad)" strokeWidth="2" opacity=".5" />
      {/* shield */}
      <path
        d="M24 12l9 3v8c0 6-4 10-9 13-5-3-9-7-9-13v-8l9-3z"
        fill="#052E2B"
        stroke="url(#shieldGrad)"
        strokeWidth="2"
      />
      {/* check */}
      <path d="M19 24l3 3 7-7" stroke="#10B981" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IntegrationsMeshIcon({ className = "w-10 h-10" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="meshGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
      {/* nodes */}
      {[
        [12,12],[24,12],[36,12],
        [12,24],[24,24],[36,24],
        [12,36],[24,36],[36,36]
      ].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="3" fill="url(#meshGrad)" />
      ))}
      {/* connectors */}
      <g stroke="url(#meshGrad)" strokeWidth="1.5" opacity=".75">
        <path d="M12 12L24 12L36 12M12 24L24 24L36 24M12 36L24 36L36 36" />
        <path d="M12 12L12 24L12 36M24 12L24 24L24 36M36 12L36 24L36 36" />
      </g>
      {/* small plug */}
      <rect x="20.5" y="40" width="7" height="3" rx="1.5" fill="url(#meshGrad)" />
      <rect x="21.5" y="37" width="5" height="3" rx="1.5" fill="url(#meshGrad)" />
    </svg>
  );
}

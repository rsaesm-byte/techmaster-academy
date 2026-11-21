import { useId } from 'react';

/** Marca da TechMaster: um "T" de trilhas de circuito dentro de um hexágono neon. */
export function Logo() {
  const id = useId();
  const neon = `${id}-neon`;
  return (
    <span className="flex items-center gap-2.5">
      <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id={neon} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22D3EE" />
            <stop offset=".55" stopColor="#6366F1" />
            <stop offset="1" stopColor="#C026D3" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="15" fill="#08112A" />
        <g fill="none" stroke={`url(#${neon})`} strokeLinecap="round" strokeLinejoin="round">
          <path d="M32 8 52 19.5v25L32 56 12 44.5v-25Z" strokeWidth="4" />
          <path d="M21 25h22M32 25v18" strokeWidth="6" />
          <path d="M21 25l-4 4M43 25l4 4M32 37l-5 5" strokeWidth="2.5" />
        </g>
        <circle cx="32" cy="47" r="3.6" fill="#FBBF24" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight">
        Tech
        <span className="bg-gradient-to-r from-[#0891b2] via-[#6366f1] to-[#c026d3] bg-clip-text text-transparent">
          Master
        </span>{' '}
        <span className="font-medium text-muted">Academy</span>
      </span>
    </span>
  );
}

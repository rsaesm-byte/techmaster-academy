import { useId } from 'react';

/** Ícone "Camadas": três camadas que flutuam e um ponto de dados que desce por elas. */
export function LogoIcone({ tamanho = 32 }: { tamanho?: number }) {
  const id = useId();
  const neon = `${id}-neon`;
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={neon} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22D3EE" />
          <stop offset=".55" stopColor="#6366F1" />
          <stop offset="1" stopColor="#C026D3" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="#08112A" />
      <g
        fill="none"
        stroke={`url(#${neon})`}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path className="logo-camada logo-camada-3" d="M12 43l20 10 20-10" />
        <path className="logo-camada logo-camada-2" d="M12 32l20 10 20-10" />
        <path
          className="logo-camada logo-camada-1"
          d="M32 12 52 22 32 32 12 22Z"
          fill="#6366F1"
          fillOpacity=".25"
        />
      </g>
      <circle className="logo-dado" cx="32" cy="22" r="3.6" fill="#FBBF24" />
    </svg>
  );
}

/** Marca da TechMaster: o ícone Camadas ao lado do nome. */
export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoIcone />
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

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect
          x="1"
          y="1"
          width="26"
          height="26"
          rx="7"
          fill="none"
          className="stroke-primary"
          strokeWidth="2"
        />
        <path
          d="M8 10h12M14 10v10"
          className="stroke-primary"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="21" cy="20" r="2" className="fill-accent" />
      </svg>
      <span className="text-[17px] font-bold tracking-tight">
        TechMaster <span className="font-medium text-muted">Academy</span>
      </span>
    </span>
  );
}

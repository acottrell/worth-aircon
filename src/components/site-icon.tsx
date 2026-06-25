interface SiteIconProps {
  className?: string;
}

export function SiteIcon({ className = "h-6 w-6" }: SiteIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Thermometer body */}
      <rect x="12" y="3" width="8" height="18" rx="4" className="fill-primary/20 stroke-primary" strokeWidth="1.5" />
      {/* Mercury fill — high, overflowing */}
      <rect x="14" y="8" width="4" height="11" rx="2" className="fill-primary" />
      {/* Bulb */}
      <circle cx="16" cy="24" r="5" className="fill-primary" />
      {/* Heat waves */}
      <path d="M24 8 C25.5 7, 25.5 5, 24 4" className="stroke-primary/50" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M26 11 C27.5 10, 27.5 8, 26 7" className="stroke-primary/30" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

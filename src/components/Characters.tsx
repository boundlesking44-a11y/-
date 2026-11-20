import type { ArtifactId } from '../types/book';

export function ZvyozdikSvg({
  className = 'w-16 h-16',
  happy = true,
  glow = true,
}: {
  className?: string;
  happy?: boolean;
  glow?: boolean;
}) {
  return (
    <svg viewBox="0 0 100 100" className={`${className} ${glow ? 'anim-glow' : ''}`} aria-label="Звёздик">
      <defs>
        <linearGradient id="zvGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff380" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <polygon
        points="50,6 62,36 95,38 69,58 79,91 50,72 21,91 31,58 5,38 38,36"
        fill="url(#zvGrad)"
        stroke="#d97706"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="40" cy="46" r="4.8" fill="#1c1932" />
      <circle cx="60" cy="46" r="4.8" fill="#1c1932" />
      <circle cx="41.5" cy="44.2" r="1.6" fill="#ffffff" />
      <circle cx="61.5" cy="44.2" r="1.6" fill="#ffffff" />
      {happy ? (
        <path
          d="M41 58 Q50 67 59 58"
          stroke="#1c1932"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <circle cx="50" cy="60" r="3.5" fill="#1c1932" />
      )}
      <circle cx="32" cy="54" r="4.2" fill="#fb7185" opacity="0.7" />
      <circle cx="68" cy="54" r="4.2" fill="#fb7185" opacity="0.7" />
    </svg>
  );
}

export function LuniSvg({
  className = 'w-16 h-16',
  glow = true,
}: {
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg viewBox="0 0 100 100" className={`${className} ${glow ? 'drop-shadow-[0_0_8px_rgba(199,210,254,0.6)]' : ''}`} aria-label="Луни">
      <path
        d="M64 8 A44 44 0 1 0 64 92 A34 34 0 1 1 64 8 Z"
        fill="#e0e7ff"
        stroke="#818cf8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="37" cy="43" r="4.4" fill="#1c1932" />
      <circle cx="38.5" cy="41.3" r="1.5" fill="#ffffff" />
      <path
        d="M29 58 Q39 67 49 58"
        stroke="#1c1932"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="26" cy="52" r="3.8" fill="#fb7185" opacity="0.7" />
    </svg>
  );
}

export function ArtifactIconSvg({
  id,
  className = 'w-10 h-10',
}: {
  id: ArtifactId;
  className?: string;
}) {
  switch (id) {
    case 'uv_lens':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <circle cx="28" cy="28" r="16" fill="#6366f1" fillOpacity="0.25" stroke="#fbbf24" strokeWidth="3.5" />
          <circle cx="24" cy="24" r="5" fill="#fef08a" opacity="0.8" />
          <line x1="40" y1="40" x2="56" y2="56" stroke="#d97706" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case 'brass_key':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <circle cx="20" cy="32" r="10" fill="none" stroke="#f59e0b" strokeWidth="4.5" />
          <rect x="29" y="29.5" width="26" height="5" rx="2" fill="#f59e0b" />
          <rect x="44" y="34" width="4" height="8" fill="#f59e0b" />
          <rect x="51" y="34" width="4" height="6" fill="#f59e0b" />
        </svg>
      );
    case 'astro_compass':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <circle cx="32" cy="32" r="22" fill="none" stroke="#f59e0b" strokeWidth="3" />
          <circle cx="32" cy="32" r="13" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeDasharray="4 3" />
          <polygon points="32,12 36,32 32,29 28,32" fill="#fbbf24" />
          <polygon points="32,52 36,32 32,35 28,32" fill="#94a3b8" />
          <circle cx="32" cy="32" r="3" fill="#fff" />
        </svg>
      );
    case 'echo_crystal':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <polygon points="32,6 48,26 42,56 22,56 16,26" fill="#38bdf8" stroke="#bae6fd" strokeWidth="2.5" />
          <polygon points="32,6 48,26 32,42" fill="#0284c7" opacity="0.45" />
          <circle cx="27" cy="24" r="2.5" fill="#fff" />
        </svg>
      );
    case 'luni_feather':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <path d="M48 12 C28 14, 16 28, 16 50 C26 46, 42 36, 48 12 Z" fill="#e0e7ff" stroke="#818cf8" strokeWidth="2.5" />
          <path d="M12 54 L44 16" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'star_fuel':
      return (
        <svg viewBox="0 0 64 64" className={className}>
          <rect x="22" y="18" width="20" height="34" rx="6" fill="#fb923c" fillOpacity="0.25" stroke="#f97316" strokeWidth="3" />
          <rect x="26" y="10" width="12" height="8" rx="2" fill="#cbd5e1" />
          <path d="M32 25 C37 31, 39 38, 32 45 C25 38, 27 31, 32 25 Z" fill="#fbbf24" />
        </svg>
      );
  }
}

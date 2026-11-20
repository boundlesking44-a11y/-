interface SceneIllustrationProps {
  pageId: number;
  nightGlow: boolean;
  questCompleted: boolean;
}

/* Pure SVG-native Zvyozdik glyph safe to place at any (x, y, size) inside an SVG scene */
function ZvyozdikInScene({
  x,
  y,
  size = 56,
  floating = false,
  happy = true,
}: {
  x: number;
  y: number;
  size?: number;
  floating?: boolean;
  happy?: boolean;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <g className={floating ? 'anim-float' : undefined}>
        <svg x={0} y={0} width={size} height={size} viewBox="0 0 100 100">
          <defs>
            <linearGradient id="sceneZvGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff59d" />
              <stop offset="55%" stopColor="#ffd54f" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="52" r="40" fill="#fbbf24" opacity="0.16" />
          <polygon
            points="50,7 62,36 94,38 69,58 78,90 50,72 22,90 31,58 6,38 38,36"
            fill="url(#sceneZvGrad)"
            stroke="#d97706"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <circle cx="40" cy="46" r="4.6" fill="#1c1932" />
          <circle cx="60" cy="46" r="4.6" fill="#1c1932" />
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
            <circle cx="50" cy="60" r="3.4" fill="#1c1932" />
          )}
          <circle cx="31" cy="54" r="4.2" fill="#fb7185" opacity="0.7" />
          <circle cx="69" cy="54" r="4.2" fill="#fb7185" opacity="0.7" />
        </svg>
      </g>
    </g>
  );
}

/* Pure SVG-native Luni glyph safe to place at any (x, y, size) inside an SVG scene */
function LuniInScene({
  x,
  y,
  size = 50,
  floating = false,
}: {
  x: number;
  y: number;
  size?: number;
  floating?: boolean;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <g className={floating ? 'anim-float' : undefined}>
        <svg x={0} y={0} width={size} height={size} viewBox="0 0 100 100">
          <circle cx="45" cy="50" r="38" fill="#a5b4fc" opacity="0.16" />
          <path
            d="M64 10 A42 42 0 1 0 64 90 A32 32 0 1 1 64 10 Z"
            fill="#e0e7ff"
            stroke="#818cf8"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          <circle cx="37" cy="43" r="4.3" fill="#1c1932" />
          <circle cx="38.5" cy="41.3" r="1.5" fill="#ffffff" />
          <path
            d="M29 58 Q39 66 49 58"
            stroke="#1c1932"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="26" cy="52" r="3.8" fill="#fb7185" opacity="0.7" />
        </svg>
      </g>
    </g>
  );
}

/* 4-point star sparkle helper */
function Sparkle4({ cx, cy, r = 5, fill = '#fde047' }: { cx: number; cy: number; r?: number; fill?: string }) {
  return (
    <path
      d={`M ${cx} ${cy - r} Q ${cx} ${cy} ${cx + r} ${cy} Q ${cx} ${cy} ${cx} ${cy + r} Q ${cx} ${cy} ${cx - r} ${cy} Q ${cx} ${cy} ${cx} ${cy - r} Z`}
      fill={fill}
    />
  );
}

export function SceneIllustration({
  pageId,
  nightGlow,
  questCompleted,
}: SceneIllustrationProps) {
  const skyTop = nightGlow ? '#06081e' : '#100d42';
  const skyBottom = nightGlow ? '#211b63' : '#4331b0';

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border shadow-inner transition-colors duration-500 ${
        nightGlow ? 'border-amber-300/35 bg-[#070a24]' : 'border-indigo-950/25 bg-[#120e44]'
      }`}
    >
      <svg viewBox="0 0 360 180" className="w-full h-auto block">
        <defs>
          <linearGradient id={`sceneSky-${pageId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skyTop} />
            <stop offset="100%" stopColor={skyBottom} />
          </linearGradient>
          <radialGradient id={`nebula-${pageId}`} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="360" height="180" fill={`url(#sceneSky-${pageId})`} />
        <rect width="360" height="180" fill={`url(#nebula-${pageId})`} />

        {/* Ambient stars & 4-point sparkles */}
        <circle cx="28" cy="24" r="1.4" fill="#ffffff" className="anim-twinkle" />
        <circle cx="88" cy="18" r="1.8" fill="#fde047" className="anim-twinkle" />
        <circle cx="255" cy="26" r="1.5" fill="#ffffff" className="anim-twinkle" />
        <circle cx="328" cy="22" r="2" fill="#fde047" className="anim-twinkle" />
        <circle cx="312" cy="72" r="1.3" fill="#cbd5e1" className="anim-twinkle" />
        <circle cx="44" cy="68" r="1.3" fill="#cbd5e1" className="anim-twinkle" />
        <g className="anim-twinkle">
          <Sparkle4 cx={62} cy={36} r={4.5} />
          <Sparkle4 cx={296} cy={42} r={5} fill="#e0e7ff" />
        </g>

        {/* Page 1: Cover Orbit */}
        {pageId === 1 && (
          <g>
            <circle cx="180" cy="90" r="68" fill="none" stroke="rgba(255,255,255,0.22)" strokeDasharray="5 7" />
            <circle cx="180" cy="90" r="46" fill="none" stroke="rgba(251,191,36,0.22)" />
            <g style={{ transformOrigin: '180px 90px' }} className="anim-orbit">
              <circle cx="180" cy="90" r="68" fill="none" stroke="none" />
              <circle cx="248" cy="90" r="8" fill="#38bdf8" stroke="#bae6fd" strokeWidth="1.5" />
              <circle cx="112" cy="90" r="6.5" fill="#fb7185" stroke="#fecdd3" strokeWidth="1.5" />
            </g>
            <ZvyozdikInScene x={135} y={45} size={90} floating />
          </g>
        )}

        {/* Page 2: Luminous Open Book */}
        {pageId === 2 && (
          <g>
            <ellipse cx="180" cy="144" rx="88" ry="14" fill="#fbbf24" opacity={nightGlow ? '0.28' : '0.14'} />
            <g transform="translate(105, 42)">
              <g className="anim-float">
                {/* Book cover shadow */}
                <rect x="6" y="16" width="138" height="90" rx="8" fill="#312e81" />
                {/* Left & right open pages */}
                <path d="M12 18 Q44 12 75 20 L75 100 Q44 92 12 98 Z" fill="#fef9ec" stroke="#fbbf24" strokeWidth="2.2" />
                <path d="M138 18 Q106 12 75 20 L75 100 Q106 92 138 98 Z" fill="#fcf3d9" stroke="#fbbf24" strokeWidth="2.2" />
                <line x1="75" y1="20" x2="75" y2="100" stroke="#6366f1" strokeWidth="2.5" />
                {/* Text lines */}
                <line x1="22" y1="36" x2="62" y2="36" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="22" y1="48" x2="58" y2="48" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="22" y1="60" x2="54" y2="60" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                {/* Secret glowing ink lines on right page */}
                <line x1="88" y1="36" x2="126" y2="36" stroke={nightGlow ? '#f59e0b' : '#cbd5e1'} strokeWidth="2.5" strokeLinecap="round" />
                <line x1="88" y1="48" x2="120" y2="48" stroke={nightGlow ? '#f59e0b' : '#cbd5e1'} strokeWidth="2.5" strokeLinecap="round" />
                <Sparkle4 cx={108} cy={74} r={10} fill={nightGlow ? '#fde047' : '#e2e8f0'} />
              </g>
            </g>
          </g>
        )}

        {/* Page 3: Zvyozdik's Little Planet */}
        {pageId === 3 && (
          <g>
            {/* Curved violet horizon */}
            <path d="M 0 132 Q 180 96 360 132 L 360 180 L 0 180 Z" fill="#4338ca" />
            <ellipse cx="95" cy="154" rx="22" ry="7" fill="#312e81" />
            <ellipse cx="265" cy="158" rx="28" ry="8" fill="#312e81" />
            {/* Cozy House */}
            <ellipse cx="78" cy="134" rx="28" ry="6" fill="#1e1b4b" opacity="0.4" />
            <rect x="82" y="76" width="10" height="20" rx="2" fill="#9a3412" />
            <rect x="54" y="96" width="46" height="36" rx="3" fill="#f59e0b" stroke="#b45309" strokeWidth="1.8" />
            <polygon points="46,97 77,70 108,97" fill="#ef4444" stroke="#991b1b" strokeWidth="1.8" strokeLinejoin="round" />
            <rect x="70" y="110" width="12" height="22" rx="2" fill="#78350f" />
            <circle cx="62" cy="108" r="4.5" fill="#fef08a" />
            {/* Tree */}
            <ellipse cx="282" cy="134" rx="26" ry="6" fill="#1e1b4b" opacity="0.4" />
            <rect x="276" y="102" width="12" height="32" rx="3" fill="#78350f" />
            <circle cx="282" cy="84" r="24" fill="#22c55e" />
            <circle cx="266" cy="96" r="14" fill="#16a34a" />
            <circle cx="298" cy="96" r="14" fill="#16a34a" />
            {/* Zvyozdik standing happily */}
            <ZvyozdikInScene x={152} y={56} size={58} floating />
          </g>
        )}

        {/* Page 4: Book Falling from the Sky */}
        {pageId === 4 && (
          <g>
            <path d="M 0 138 Q 180 108 360 138 L 360 180 L 0 180 Z" fill="#3730a3" />
            {/* Comet trail */}
            <path d="M272 16 L194 72" stroke="#fde047" strokeWidth="3" strokeDasharray="5 5" opacity="0.8" />
            <path d="M286 26 L210 80" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="3 6" opacity="0.6" />
            {/* Fallen glowing book */}
            <g transform="translate(152, 62)">
              <g className="anim-float">
                <rect x="0" y="0" width="66" height="50" rx="6" fill="#fef3c7" stroke={questCompleted ? '#fbbf24' : '#94a3b8'} strokeWidth="3" />
                <line x1="33" y1="0" x2="33" y2="50" stroke="#4f46e5" strokeWidth="2.5" />
                <Sparkle4 cx={17} cy={22} r={5} fill={questCompleted ? '#f59e0b' : '#94a3b8'} />
                <Sparkle4 cx={49} cy={28} r={5} fill={questCompleted ? '#f59e0b' : '#94a3b8'} />
              </g>
            </g>
            <ZvyozdikInScene x={54} y={84} size={52} />
          </g>
        )}

        {/* Page 5: Stitched Leather Pocket */}
        {pageId === 5 && (
          <g>
            <rect x="86" y="34" width="188" height="114" rx="12" fill="#5c2410" stroke="#d97706" strokeWidth="2.5" />
            <rect x="94" y="42" width="172" height="98" rx="8" fill="none" stroke="#b45309" strokeDasharray="4 4" strokeWidth="1.5" />
            {/* Pocket */}
            <path d="M126 74 H234 V118 C234 128 226 134 216 134 H144 C134 134 126 128 126 118 Z" fill="#9a3412" stroke="#fbbf24" strokeDasharray="4 3" strokeWidth="2" />
            {/* Key peeking */}
            <circle cx="180" cy="64" r="10" fill="none" stroke="#fbbf24" strokeWidth="4" />
            <ZvyozdikInScene x={22} y={62} size={52} floating />
            <LuniInScene x={286} y={66} size={46} />
          </g>
        )}

        {/* Page 6: Sealed Secret Flap */}
        {pageId === 6 && (
          <g>
            <rect x="102" y="30" width="156" height="118" rx="10" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" />
            <path d="M102 36 L180 92 L258 36" fill="#312e81" stroke="#6366f1" strokeWidth="2" />
            <circle cx="180" cy="92" r="20" fill="#0f172a" stroke="#fbbf24" strokeWidth="2.5" />
            <circle cx="180" cy="87" r="4.5" fill="#fbbf24" />
            <polygon points="177,91 183,91 185,103 175,103" fill="#fbbf24" />
            <ZvyozdikInScene x={32} y={66} size={54} floating />
          </g>
        )}

        {/* Page 7: Astrolabe Rings */}
        {pageId === 7 && (
          <g>
            <circle cx="180" cy="90" r="62" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="6 4" />
            <circle cx="180" cy="90" r="42" fill="none" stroke="#818cf8" strokeWidth="2.5" />
            <circle cx="180" cy="90" r="22" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            <Sparkle4 cx={180} cy={28} r={7} fill="#fde047" />
            <circle cx="180" cy="90" r="6" fill="#fbbf24" />
            <ZvyozdikInScene x={36} y={64} size={54} floating />
          </g>
        )}

        {/* Page 8: Singing Crystal Pipes */}
        {pageId === 8 && (
          <g>
            <path d="M 88 134 L 272 134" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
            <polygon points="108,134 122,64 136,134" fill="#fbbf24" stroke="#fef08a" strokeWidth="1.5" />
            <polygon points="152,134 166,46 180,134" fill="#38bdf8" stroke="#bae6fd" strokeWidth="1.5" />
            <polygon points="196,134 210,58 224,134" fill="#34d399" stroke="#a7f3d0" strokeWidth="1.5" />
            <polygon points="240,134 254,70 268,134" fill="#a78bfa" stroke="#ddd6fe" strokeWidth="1.5" />
            <path d="M110 38 Q180 12 256 40" fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="5 5" />
            <ZvyozdikInScene x={32} y={68} size={52} floating />
          </g>
        )}

        {/* Page 9: Meadow of Fireflies */}
        {pageId === 9 && (
          <g>
            <path d="M 0 140 Q 180 112 360 140 L 360 180 L 0 180 Z" fill="#312e81" />
            <g className="anim-float">
              <circle cx="140" cy="64" r="6" fill="#fde047" />
              <circle cx="140" cy="64" r="12" fill="#fde047" opacity="0.25" />
              <circle cx="205" cy="48" r="7" fill="#fde047" />
              <circle cx="205" cy="48" r="14" fill="#fde047" opacity="0.25" />
              <circle cx="268" cy="72" r="6" fill="#a5f3fc" />
              <circle cx="268" cy="72" r="12" fill="#a5f3fc" opacity="0.25" />
            </g>
            <ZvyozdikInScene x={46} y={76} size={56} />
          </g>
        )}

        {/* Page 10: Ringed Azure Planet & Luni */}
        {pageId === 10 && (
          <g>
            {/* Back half of ring */}
            <path d="M 148 86 A 72 19 0 0 1 292 86" fill="none" stroke="#f59e0b" strokeWidth="6" />
            <circle cx="220" cy="88" r="36" fill="#0ea5e9" stroke="#38bdf8" strokeWidth="2" />
            <path d="M192 80 Q220 94 248 80" stroke="#bae6fd" strokeWidth="3" fill="none" />
            <circle cx="206" cy="72" r="5" fill="#0284c7" opacity="0.55" />
            {/* Front half of ring */}
            <path d="M 148 86 A 72 19 0 0 0 292 86" fill="none" stroke="#fbbf24" strokeWidth="6" />
            <LuniInScene x={252} y={24} size={46} floating />
            <ZvyozdikInScene x={44} y={66} size={56} />
          </g>
        )}

        {/* Page 11: Luni's Dusty Telescope */}
        {pageId === 11 && (
          <g>
            <path d="M 0 138 Q 180 108 360 138 L 360 180 L 0 180 Z" fill="#475569" />
            <circle cx="116" cy="150" r="12" fill="#334155" />
            <circle cx="246" cy="154" r="10" fill="#334155" />
            {/* Tripod planted nicely on ground */}
            <line x1="154" y1="136" x2="180" y2="92" stroke="#cbd5e1" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="206" y1="136" x2="180" y2="92" stroke="#cbd5e1" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="180" y1="136" x2="180" y2="92" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
            {/* Telescope tube */}
            <g transform="rotate(-22 180 86)">
              <rect x="142" y="74" width="76" height="22" rx="6" fill="#e2e8f0" stroke="#64748b" strokeWidth="2.5" />
              <rect x="208" y="71" width="12" height="28" rx="3" fill="#fbbf24" />
            </g>
            <ZvyozdikInScene x={42} y={72} size={50} />
            <LuniInScene x={266} y={72} size={48} />
          </g>
        )}

        {/* Page 12: Paper Star-Boat in Asteroid Belt */}
        {pageId === 12 && (
          <g>
            <circle cx="84" cy="48" r="14" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="284" cy="122" r="16" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="242" cy="42" r="10" fill="#64748b" />
            <g transform="translate(130, 56)">
              <g className="anim-float">
                <ZvyozdikInScene x={6} y={6} size={34} />
                <LuniInScene x={38} y={8} size={32} />
                {/* Crisp origami boat */}
                <polygon points="4,42 96,42 74,64 26,64" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" />
                <polygon points="48,6 48,42 80,42" fill="#ffffff" stroke="#818cf8" strokeWidth="2" strokeLinejoin="round" />
              </g>
            </g>
          </g>
        )}

        {/* Page 13: Owl Guardian Library Gate */}
        {pageId === 13 && (
          <g>
            <path d="M114 156 V66 A66 66 0 0 1 246 66 V156 Z" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="3" />
            {/* Owl emblem */}
            <circle cx="180" cy="68" r="22" fill="#312e81" stroke="#c7d2fe" strokeWidth="2" />
            <circle cx="171" cy="64" r="4.5" fill="#fde047" />
            <circle cx="189" cy="64" r="4.5" fill="#fde047" />
            <polygon points="176,72 184,72 180,79" fill="#f59e0b" />
            {/* 3 lock dials */}
            <rect x="134" y="106" width="92" height="28" rx="6" fill="#0f172a" stroke="#6366f1" strokeWidth="2" />
            <circle cx="152" cy="120" r="6" fill="#fbbf24" />
            <circle cx="180" cy="120" r="6" fill="#e0e7ff" />
            <circle cx="208" cy="120" r="6" fill="#38bdf8" />
            <ZvyozdikInScene x={36} y={76} size={50} />
            <LuniInScene x={274} y={76} size={48} />
          </g>
        )}

        {/* Page 14: Living Ink Alchemy Flask */}
        {pageId === 14 && (
          <g>
            <ellipse cx="180" cy="146" rx="56" ry="8" fill="#0f172a" opacity="0.45" />
            <path
              d="M164 34 H196 V60 L224 122 C228 132 221 140 210 140 H150 C139 140 132 132 136 122 L164 60 Z"
              fill="#0f172a"
              stroke="#bae6fd"
              strokeWidth="3"
            />
            <path
              d="M143 108 H217 L222 122 C225 130 219 136 210 136 H150 C141 136 135 130 138 122 Z"
              fill={questCompleted ? '#fbbf24' : '#38bdf8'}
              opacity="0.9"
            />
            <circle cx="168" cy="116" r="3" fill="#ffffff" />
            <circle cx="188" cy="112" r="2.5" fill="#ffffff" />
            <Sparkle4 cx={180} cy={80} r={7} fill="#fde047" />
            <ZvyozdikInScene x={44} y={72} size={52} />
            <LuniInScene x={264} y={72} size={48} />
          </g>
        )}

        {/* Page 15: Rocket Blueprint */}
        {pageId === 15 && (
          <g>
            <rect x="82" y="24" width="196" height="132" rx="10" fill="#0c1538" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="82" y1="68" x2="278" y2="68" stroke="#1e293b" strokeWidth="1" />
            <line x1="82" y1="112" x2="278" y2="112" stroke="#1e293b" strokeWidth="1" />
            <line x1="180" y1="24" x2="180" y2="156" stroke="#1e293b" strokeWidth="1" />
            <path d="M180 34 Q202 64 196 118 L164 118 Q158 64 180 34 Z" fill="none" stroke="#7dd3fc" strokeWidth="2.2" strokeDasharray="4 4" />
            <polygon points="164,96 146,120 164,114" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeDasharray="3 3" />
            <polygon points="196,96 214,120 196,114" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="180" cy="76" r="10" fill="none" stroke="#7dd3fc" strokeWidth="2" />
          </g>
        )}

        {/* Page 16: Rocket on Launchpad */}
        {pageId === 16 && (
          <g>
            <path d="M 0 144 Q 180 116 360 144 L 360 180 L 0 180 Z" fill="#4f46e5" />
            <g transform="translate(150, 24)">
              <g className={questCompleted ? 'anim-float' : undefined}>
                <polygon points="15,66 0,88 15,80" fill="#ef4444" />
                <polygon points="45,66 60,88 45,80" fill="#ef4444" />
                <path d="M30 0 Q52 28 46 76 L14 76 Q8 28 30 0 Z" fill="#ffffff" />
                <circle cx="30" cy="36" r="9" fill="#38bdf8" stroke="#4f46e5" strokeWidth="3" />
                <path d="M21 78 L30 108 L39 78 Z" fill="#fbbf24" className="anim-flame" />
              </g>
            </g>
            <ZvyozdikInScene x={52} y={84} size={48} />
            <LuniInScene x={260} y={86} size={46} />
          </g>
        )}

        {/* Page 17: Reading Together Under the Tree */}
        {pageId === 17 && (
          <g>
            <path d="M 0 138 Q 180 108 360 138 L 360 180 L 0 180 Z" fill="#4338ca" />
            <rect x="272" y="96" width="10" height="32" rx="3" fill="#78350f" />
            <circle cx="277" cy="84" r="22" fill="#22c55e" />
            <circle cx="262" cy="94" r="13" fill="#16a34a" />
            <ZvyozdikInScene x={110} y={76} size={54} floating />
            <LuniInScene x={172} y={80} size={48} />
            <rect x="142" y="128" width="52" height="16" rx="3" fill="#fef3c7" stroke="#fbbf24" strokeWidth="2" />
            <line x1="168" y1="128" x2="168" y2="144" stroke="#4f46e5" strokeWidth="2" />
          </g>
        )}

        {/* Page 18: Golden Medallion Finale */}
        {pageId === 18 && (
          <g>
            <circle cx="180" cy="90" r="58" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="3.5" />
            <circle cx="180" cy="90" r="48" fill="none" stroke="#fde047" strokeWidth="1.2" strokeDasharray="4 4" />
            <ZvyozdikInScene x={122} y={58} size={58} floating />
            <LuniInScene x={182} y={62} size={50} />
          </g>
        )}
      </svg>
    </div>
  );
}

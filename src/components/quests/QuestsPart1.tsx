import { useEffect, useRef, useState } from 'react';
import { Check, KeyRound, Lock, RotateCcw, Sparkles, Sun, Moon, Volume2 } from 'lucide-react';
import type { ArtifactId } from '../../types/book';
import {
  playErrorSound,
  playMechanicalClick,
  playSparkleSound,
  playSuccessFanfare,
  playTone,
} from '../../utils/audio';
import { ArtifactIconSvg, LuniSvg, ZvyozdikSvg } from '../Characters';

export interface QuestProps {
  pageId: number;
  completed: boolean;
  nightGlow: boolean;
  soundEnabled: boolean;
  artifacts: ArtifactId[];
  onComplete: (pageId: number, artifact?: ArtifactId) => void;
  onToggleNightGlow: () => void;
  onNextPage: () => void;
}

/* Страница 1: Сургучная печать на обложке */
export function CoverWaxSealQuest({
  completed,
  soundEnabled,
  onComplete,
  onNextPage,
}: QuestProps) {
  const [cracked, setCracked] = useState(completed);

  const handleOpen = () => {
    playMechanicalClick(soundEnabled);
    setCracked(true);
    if (!completed) {
      playSuccessFanfare(soundEnabled);
      onComplete(1);
    }
    setTimeout(() => onNextPage(), 420);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-2 text-center">
      <div className="relative flex items-center justify-center w-52 h-52">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle
            cx="100"
            cy="100"
            r="86"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeDasharray="5 7"
          />
          <g className="anim-orbit">
            <circle cx="186" cy="100" r="8" fill="#38bdf8" />
            <circle cx="14" cy="100" r="6" fill="#fb7185" />
          </g>
        </svg>

        <button
          type="button"
          onClick={handleOpen}
          className={`absolute w-32 h-32 rounded-full flex flex-col items-center justify-center border-2 transition-transform duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400 ${
            cracked
              ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-200 scale-95'
              : 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-200 text-indigo-950 shadow-[0_0_30px_rgba(251,191,36,0.45)] hover:scale-105 active:scale-95'
          }`}
        >
          <Sparkles className="w-7 h-7 mb-1" />
          <span className="font-display font-bold text-sm leading-tight px-2">
            {cracked ? 'Открыто' : 'Снять печать'}
          </span>
        </button>
      </div>

      <p className="text-sm opacity-80 max-w-xs">
        {completed
          ? 'Печать снята! Переходи к следующей странице или нажми на печать снова.'
          : 'Нажми на золотую печать Хранителя, чтобы распахнуть Книгу-Звезду.'}
      </p>
    </div>
  );
}

/* Страница 2: Ночной свет + УФ-лупа тайнописи */
export function UvMagnifierQuest({
  completed,
  nightGlow,
  soundEnabled,
  onComplete,
  onToggleNightGlow,
}: QuestProps) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const [revealedZones, setRevealedZones] = useState<number[]>(completed ? [0, 1, 2] : []);

  const secretZones = [
    { id: 0, x: 24, y: 28, text: 'Бумага хранит тепло рук,' },
    { id: 1, x: 70, y: 50, text: 'Свет пробуждает рисунки,' },
    { id: 2, x: 42, y: 76, text: 'А сказка оживает с тобой!' },
  ];

  const handlePointerMove = (clientX: number, clientY: number) => {
    const el = boxRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(8, Math.min(92, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(12, Math.min(88, ((clientY - rect.top) / rect.height) * 100));
    setLensPos({ x, y });

    secretZones.forEach((z) => {
      const dist = Math.hypot(x - z.x, y - z.y);
      if (dist < 22 && !revealedZones.includes(z.id)) {
        const next = [...revealedZones, z.id];
        setRevealedZones(next);
        playSparkleSound(soundEnabled);
        if (next.length === secretZones.length && !completed) {
          playSuccessFanfare(soundEnabled);
          onComplete(2, 'uv_lens');
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            playMechanicalClick(soundEnabled);
            onToggleNightGlow();
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer whitespace-nowrap ${
            nightGlow
              ? 'bg-amber-400 text-indigo-950 border-amber-300'
              : 'bg-indigo-950 text-amber-200 border-indigo-800 hover:bg-indigo-900'
          }`}
        >
          {nightGlow ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {nightGlow ? 'Выключить ночной свет' : 'Включить ночной свет'}
        </button>

        <span className="text-xs font-code opacity-80">
          Найдено строк: {revealedZones.length} / 3
        </span>
      </div>

      <div
        ref={boxRef}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onTouchMove={(e) => {
          if (e.touches[0]) {
            handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        onClick={(e) => handlePointerMove(e.clientX, e.clientY)}
        className="relative h-56 rounded-xl border border-indigo-500/30 bg-[#0d102b] overflow-hidden select-none touch-none cursor-crosshair"
      >
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center pointer-events-none">
          <p className="text-xs uppercase tracking-widest text-indigo-300/40">
            Проведи линзой по тёмному пергаменту
          </p>
        </div>

        {/* Hidden glowing runes */}
        {secretZones.map((zone) => {
          const near = Math.hypot(lensPos.x - zone.x, lensPos.y - zone.y) < 23;
          const found = revealedZones.includes(zone.id);
          return (
            <div
              key={zone.id}
              style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded text-sm font-medium whitespace-nowrap transition-opacity duration-200 pointer-events-none ${
                found || near
                  ? 'opacity-100 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]'
                  : 'opacity-0'
              }`}
            >
              {zone.text}
            </div>
          );
        })}

        {/* Magnifier spotlight */}
        <div
          style={{ left: `${lensPos.x}%`, top: `${lensPos.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-amber-300/80 bg-amber-300/10 shadow-[0_0_25px_rgba(251,191,36,0.35)] pointer-events-none"
        />
      </div>

      {completed && (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-amber-400/40 bg-amber-500/10 text-sm">
          <ArtifactIconSvg id="uv_lens" className="w-8 h-8 shrink-0" />
          <span>Тайнопись проявлена! Получен артефакт: Линза Ночного Света.</span>
        </div>
      )}
    </div>
  );
}

/* Страница 3: Живая диорама планеты Звёздика */
export function LivingPlanetDiorama({
  completed,
  soundEnabled,
  onComplete,
}: QuestProps) {
  const [found, setFound] = useState<string[]>(
    completed ? ['chimney', 'tree', 'telescope'] : [],
  );
  const [shootingStar, setShootingStar] = useState(false);

  const triggerPart = (part: string) => {
    playSparkleSound(soundEnabled);
    if (part === 'telescope') {
      setShootingStar(true);
      setTimeout(() => setShootingStar(false), 1200);
    }
    if (!found.includes(part)) {
      const next = [...found, part];
      setFound(next);
      if (next.length === 3 && !completed) {
        playSuccessFanfare(soundEnabled);
        onComplete(3);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs font-code opacity-80">
        <span>Интерактивная диорама</span>
        <span>Найдено чудес: {found.length} / 3</span>
      </div>

      <svg
        viewBox="0 0 320 210"
        className="w-full rounded-xl border border-indigo-500/30 bg-gradient-to-b from-[#0b0d2c] to-[#2e2678]"
      >
        {/* Shooting star */}
        {shootingStar && (
          <line
            x1="280"
            y1="20"
            x2="180"
            y2="75"
            stroke="#fde047"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        <circle cx="46" cy="30" r="2" fill="#fff" className="anim-twinkle" />
        <circle cx="240" cy="38" r="2" fill="#fde047" className="anim-twinkle" />

        {/* Planet ground */}
        <circle cx="160" cy="275" r="145" fill="#4f46e5" />

        {/* Clickable House & Chimney */}
        <g
          onClick={() => triggerPart('chimney')}
          className="cursor-pointer hover:opacity-90"
          role="button"
          tabIndex={0}
        >
          <rect x="76" y="92" width="12" height="22" fill="#9a3412" />
          {found.includes('chimney') && (
            <g className="anim-float">
              <circle cx="82" cy="76" r="6" fill="#e2e8f0" opacity="0.7" />
              <circle cx="88" cy="62" r="8" fill="#e2e8f0" opacity="0.5" />
            </g>
          )}
          <rect x="44" y="114" width="54" height="42" rx="3" fill="#f59e0b" />
          <polygon points="36,114 71,86 106,114" fill="#ef4444" />
          <rect x="64" y="130" width="14" height="26" fill="#78350f" />
          <circle cx="54" cy="128" r="5" fill="#fef08a" />
        </g>

        {/* Clickable Telescope */}
        <g
          onClick={() => triggerPart('telescope')}
          className="cursor-pointer hover:opacity-90"
          role="button"
          tabIndex={0}
        >
          <line x1="150" y1="152" x2="162" y2="128" stroke="#cbd5e1" strokeWidth="3.5" />
          <line x1="174" y1="152" x2="162" y2="128" stroke="#cbd5e1" strokeWidth="3.5" />
          <rect
            x="144"
            y="112"
            width="42"
            height="12"
            rx="4"
            transform="rotate(-24 162 120)"
            fill="#fbbf24"
            stroke="#78350f"
            strokeWidth="2"
          />
          <circle cx="162" cy="120" r="18" fill="transparent" />
        </g>

        {/* Clickable Tree with fireflies */}
        <g
          onClick={() => triggerPart('tree')}
          className="cursor-pointer hover:opacity-90"
          role="button"
          tabIndex={0}
        >
          <rect x="244" y="116" width="12" height="38" fill="#78350f" />
          <circle cx="250" cy="96" r="28" fill="#22c55e" />
          <circle cx="232" cy="108" r="16" fill="#16a34a" />
          <circle cx="268" cy="108" r="15" fill="#16a34a" />
          {found.includes('tree') && (
            <g className="anim-twinkle">
              <circle cx="235" cy="86" r="3" fill="#fde047" />
              <circle cx="262" cy="94" r="3.5" fill="#fde047" />
              <circle cx="248" cy="110" r="2.8" fill="#fde047" />
            </g>
          )}
        </g>
      </svg>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        {[
          { id: 'chimney', label: 'Печная труба' },
          { id: 'telescope', label: 'Телескоп' },
          { id: 'tree', label: 'Дерево светлячков' },
        ].map((item) => {
          const active = found.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => triggerPart(item.id)}
              className={`py-2 px-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                active
                  ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                  : 'border-current/20 hover:border-amber-400'
              }`}
            >
              {active ? `✓ ${item.label}` : item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Страница 4: Зажги 5 звёзд по порядку */
export function ConstellationWakeQuest({
  completed,
  soundEnabled,
  onComplete,
}: QuestProps) {
  const starNodes = [
    { id: 1, x: 55, y: 135 },
    { id: 2, x: 95, y: 55 },
    { id: 3, x: 165, y: 95 },
    { id: 4, x: 235, y: 45 },
    { id: 5, x: 270, y: 135 },
  ];

  const [litCount, setLitCount] = useState(completed ? 5 : 0);
  const [feedback, setFeedback] = useState(
    completed ? 'Созвездие сияет! Книга-Звезда проснулась.' : 'Нажми на звезду № 1.',
  );

  const handleStarClick = (num: number) => {
    if (completed || litCount >= 5) return;
    if (num === litCount + 1) {
      const next = litCount + 1;
      setLitCount(next);
      playTone(440 + next * 95, 0.25, 'triangle', soundEnabled, 0.14);
      if (next === 5) {
        setFeedback('Ура! Все 5 звёзд горят — Книга-Звезда проснулась!');
        playSuccessFanfare(soundEnabled);
        onComplete(4);
      } else {
        setFeedback(`Отлично! Теперь найди звезду № ${next + 1}.`);
      }
    } else if (num > litCount + 1) {
      playErrorSound(soundEnabled);
      setFeedback(`Не спеши! Сейчас нужна звезда № ${litCount + 1}.`);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs font-code opacity-80">
        <span>Созвездие пробуждения</span>
        <span>Зажжено: {litCount} / 5</span>
      </div>

      <svg
        viewBox="0 0 320 185"
        className="w-full rounded-xl border border-indigo-500/30 bg-[#0b0e2e]"
      >
        {starNodes.slice(0, -1).map((node, idx) => {
          const next = starNodes[idx + 1];
          const isDrawn = litCount > idx + 1;
          return (
            <line
              key={node.id}
              x1={node.x}
              y1={node.y}
              x2={next.x}
              y2={next.y}
              stroke={isDrawn ? '#fbbf24' : 'rgba(148,163,184,0.35)'}
              strokeWidth={isDrawn ? '3' : '2'}
              strokeDasharray={isDrawn ? undefined : '5 5'}
            />
          );
        })}

        {starNodes.map((node) => {
          const isLit = node.id <= litCount;
          const isNext = node.id === litCount + 1;
          return (
            <g
              key={node.id}
              onClick={() => handleStarClick(node.id)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r="22"
                fill={isNext ? 'rgba(251,191,36,0.16)' : 'transparent'}
              />
              <polygon
                points={`${node.x},${node.y - 16} ${node.x + 5},${node.y - 5} ${node.x + 16},${node.y - 4} ${node.x + 7},${node.y + 4} ${node.x + 10},${node.y + 16} ${node.x},${node.y + 9} ${node.x - 10},${node.y + 16} ${node.x - 7},${node.y + 4} ${node.x - 16},${node.y - 4} ${node.x - 5},${node.y - 5}`}
                fill={isLit ? '#fde047' : '#334155'}
                stroke={isNext ? '#fbbf24' : '#94a3b8'}
                strokeWidth="1.8"
              />
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill={isLit ? '#1c1932' : '#e2e8f0'}
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="text-sm font-medium">{feedback}</p>
    </div>
  );
}

/* Страница 5: Потайной карман и ключ */
export function SecretPocketQuest({
  completed,
  soundEnabled,
  onComplete,
}: QuestProps) {
  const [unbuckled, setUnbuckled] = useState(completed);
  const [pulled, setPulled] = useState(completed);

  const handleUnbuckle = () => {
    playMechanicalClick(soundEnabled);
    setUnbuckled(true);
  };

  const handlePullKey = () => {
    if (!unbuckled) {
      playErrorSound(soundEnabled);
      return;
    }
    setPulled(true);
    playSparkleSound(soundEnabled);
    if (!completed) {
      playSuccessFanfare(soundEnabled);
      onComplete(5, 'brass_key');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="relative w-72 h-52 flex flex-col items-center justify-end">
        {/* Brass Key: sits tucked inside until unbuckled, then pops clearly above the pocket rim (z-30) */}
        <button
          type="button"
          onClick={handlePullKey}
          aria-label="Вытянуть латунный ключ"
          className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-amber-400 bg-amber-50 text-indigo-950 font-bold text-sm shadow-lg transition-all duration-500 cursor-pointer ${
            pulled
              ? 'bottom-36 z-30 scale-105 ring-4 ring-amber-300/40'
              : unbuckled
                ? 'bottom-24 z-30 hover:bottom-28 animate-bounce'
                : 'bottom-6 z-10 opacity-40 pointer-events-none'
          }`}
        >
          <KeyRound className="w-5 h-5 text-amber-600 shrink-0" />
          <span className="whitespace-nowrap">
            {pulled ? 'Ключ в руках!' : 'Потяни ключ!'}
          </span>
        </button>

        {/* Stitched Pocket Front */}
        <div
          onClick={() => {
            if (unbuckled && !pulled) handlePullKey();
          }}
          className={`relative z-20 w-64 h-28 rounded-b-2xl rounded-t-md bg-gradient-to-b from-amber-700 to-amber-900 border-2 border-dashed border-amber-300/70 shadow-lg flex flex-col items-center justify-end pb-3 px-4 ${
            unbuckled && !pulled ? 'cursor-pointer' : ''
          }`}
        >
          {/* Fold-over Flap / Buckle */}
          <div
            className={`absolute inset-x-0 top-0 h-10 rounded-t-md bg-amber-800 border-b-2 border-amber-300/40 flex items-center justify-center transition-transform duration-500 origin-bottom ${
              unbuckled ? '-translate-y-1 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
            }`}
          >
            <span className="text-xs font-semibold text-amber-200 tracking-wide">
              Застёгнутый клапан
            </span>
          </div>

          <span className="text-xs text-amber-100 text-center leading-snug">
            {pulled
              ? 'Латунный ключ добавлен в сумку артефактов!'
              : unbuckled
                ? 'Нажми на высунувшийся золотой ключ сверху'
                : 'Карман застёгнут на ремешок'}
          </span>
        </div>
      </div>

      {/* Explicit step buttons so mouse, touch, and keyboard users never get stuck */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {!unbuckled ? (
          <button
            type="button"
            onClick={handleUnbuckle}
            className="px-4 py-2 rounded-lg bg-amber-400 text-indigo-950 font-semibold text-sm hover:bg-amber-300 transition-colors cursor-pointer"
          >
            1. Расстегнуть пряжку
          </button>
        ) : !pulled ? (
          <button
            type="button"
            onClick={handlePullKey}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-indigo-950 font-semibold text-sm hover:bg-amber-300 transition-colors cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            2. Достать ключ из кармана
          </button>
        ) : null}
      </div>

      {pulled && (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-amber-400/50 bg-amber-500/12 text-sm w-full">
          <ArtifactIconSvg id="brass_key" className="w-8 h-8 shrink-0" />
          <span>Получен артефакт: Латунный Ключ Откровения.</span>
        </div>
      )}
    </div>
  );
}

/* Страница 6: Замок и 3D откидной клапан */
export function SecretFlapQuest({
  completed,
  soundEnabled,
  artifacts,
  onComplete,
}: QuestProps) {
  const hasKey = artifacts.includes('brass_key') || completed;
  const [unlocked, setUnlocked] = useState(completed);
  const [flapOpen, setFlapOpen] = useState(completed);

  const handleUnlock = () => {
    playMechanicalClick(soundEnabled);
    setUnlocked(true);
  };

  const handleFlipFlap = () => {
    if (!unlocked) {
      playErrorSound(soundEnabled);
      return;
    }
    const next = !flapOpen;
    setFlapOpen(next);
    playSparkleSound(soundEnabled);
    if (next && !completed) {
      playSuccessFanfare(soundEnabled);
      onComplete(6);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {!unlocked && (
          <button
            type="button"
            onClick={handleUnlock}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-indigo-950 font-semibold text-sm hover:bg-amber-300 transition-colors cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            {hasKey ? 'Повернуть ключ из сумки' : 'Открыть запасной отмычкой'}
          </button>
        )}
        {unlocked && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-300">
            <Check className="w-4 h-4" /> Замок открыт
          </span>
        )}
      </div>

      {/* 3D Origami Flap */}
      <div className="w-full max-w-sm h-44 perspective-1000">
        <div
          onClick={handleFlipFlap}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleFlipFlap();
          }}
          className="relative w-full h-full cursor-pointer select-none"
        >
          {/* Under layer */}
          <div className="absolute inset-0 rounded-xl bg-[#191642] border border-amber-400/50 p-4 flex flex-col items-center justify-center text-center text-amber-100">
            <p className="text-xs uppercase tracking-widest text-amber-300 mb-1">
              Послание Луни
            </p>
            <p className="text-sm leading-relaxed">
              «Друг! В будущем книги будут петь, светиться в ночи и хранить целые миры. Ищи меня на планете, где сияет золотое кольцо!»
            </p>
          </div>

          {/* Rotating front flap */}
          <div
            style={{
              transformOrigin: 'top center',
              transform: flapOpen ? 'rotateX(165deg)' : 'rotateX(0deg)',
            }}
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-700 to-indigo-900 border-2 border-indigo-400/50 text-white p-4 flex flex-col items-center justify-center text-center transition-transform duration-700 backface-hidden shadow-lg"
          >
            {unlocked ? (
              <>
                <Sparkles className="w-7 h-7 text-amber-300 mb-2" />
                <span className="font-display font-bold text-lg">Нажми, чтобы откинуть клапан</span>
              </>
            ) : (
              <>
                <Lock className="w-7 h-7 text-amber-300 mb-2" />
                <span className="font-display font-bold text-base">Запечатано замком</span>
                <span className="text-xs opacity-75 mt-1">Сначала поверни ключ сверху</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Страница 7: Астролябия с 3 вращающимися кольцами */
export function AstrolabeQuest({
  completed,
  soundEnabled,
  onComplete,
}: QuestProps) {
  const [angles, setAngles] = useState<[number, number, number]>(
    completed ? [0, 0, 0] : [90, 180, 270],
  );

  const rotateRing = (index: 0 | 1 | 2) => {
    const next: [number, number, number] = [...angles] as [number, number, number];
    next[index] = (next[index] + 90) % 360;
    setAngles(next);
    playMechanicalClick(soundEnabled);

    if (next[0] === 0 && next[1] === 0 && next[2] === 0 && !completed) {
      playSuccessFanfare(soundEnabled);
      onComplete(7, 'astro_compass');
    }
  };

  const allAligned = angles[0] === 0 && angles[1] === 0 && angles[2] === 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-52 h-52">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* North pointer marker */}
          <polygon points="100,4 106,16 94,16" fill="#fbbf24" />

          {/* Outer ring */}
          <g transform={`rotate(${angles[0]} 100 100)`} className="transition-transform duration-300">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" strokeWidth="10" strokeOpacity="0.35" />
            <circle cx="100" cy="20" r="7" fill={angles[0] === 0 ? '#34d399' : '#fbbf24'} />
          </g>

          {/* Middle ring */}
          <g transform={`rotate(${angles[1]} 100 100)`} className="transition-transform duration-300">
            <circle cx="100" cy="100" r="56" fill="none" stroke="#818cf8" strokeWidth="10" strokeOpacity="0.45" />
            <circle cx="100" cy="44" r="7" fill={angles[1] === 0 ? '#34d399' : '#a5b4fc'} />
          </g>

          {/* Inner ring */}
          <g transform={`rotate(${angles[2]} 100 100)`} className="transition-transform duration-300">
            <circle cx="100" cy="100" r="32" fill="none" stroke="#38bdf8" strokeWidth="10" strokeOpacity="0.45" />
            <circle cx="100" cy="68" r="6" fill={angles[2] === 0 ? '#34d399' : '#7dd3fc'} />
          </g>

          <circle cx="100" cy="100" r="10" fill={allAligned ? '#34d399' : '#fbbf24'} />
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full">
        {(['Внешнее', 'Среднее', 'Внутреннее'] as const).map((label, idx) => {
          const ok = angles[idx] === 0;
          return (
            <button
              key={label}
              type="button"
              onClick={() => rotateRing(idx as 0 | 1 | 2)}
              className={`py-2 px-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                ok
                  ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                  : 'border-current/25 hover:border-amber-400'
              }`}
            >
              {label} · {angles[idx]}°
            </button>
          );
        })}
      </div>

      {allAligned && (
        <div className="flex items-center gap-3 p-2.5 rounded-lg border border-amber-400/40 bg-amber-500/10 text-xs w-full">
          <ArtifactIconSvg id="astro_compass" className="w-7 h-7 shrink-0" />
          <span>Курс проложен! Получен артефакт: Звёздная Астролябия.</span>
        </div>
      )}
    </div>
  );
}

/* Страница 8: Музыкальные кристаллы памяти */
export function EchoMelodyQuest({
  completed,
  soundEnabled,
  onComplete,
}: QuestProps) {
  const crystals = [
    { id: 0, name: 'Солнечный', freq: 523.25, color: 'bg-amber-400 text-indigo-950' },
    { id: 1, name: 'Лазурный', freq: 659.25, color: 'bg-sky-400 text-indigo-950' },
    { id: 2, name: 'Изумрудный', freq: 783.99, color: 'bg-emerald-400 text-indigo-950' },
    { id: 3, name: 'Фиалковый', freq: 987.77, color: 'bg-violet-400 text-indigo-950' },
  ];
  const targetSeq = [0, 2, 1, 3];

  const [activeCrystal, setActiveCrystal] = useState<number | null>(null);
  const [playingDemo, setPlayingDemo] = useState(false);
  const [userSeq, setUserSeq] = useState<number[]>(completed ? targetSeq : []);
  const [status, setStatus] = useState(
    completed
      ? 'Мелодия восстановлена! Кристалл Эха снова поёт.'
      : 'Нажми «Послушать мелодию», затем повтори 4 ноты.',
  );

  const timersRef = useRef<number[]>([]);
  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const playDemo = () => {
    if (playingDemo) return;
    setPlayingDemo(true);
    setUserSeq([]);
    setStatus('Слушай внимательно...');
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];

    targetSeq.forEach((crystalId, step) => {
      const t1 = window.setTimeout(() => {
        setActiveCrystal(crystalId);
        playTone(crystals[crystalId].freq, 0.35, 'triangle', true, 0.16);
      }, step * 520);
      const t2 = window.setTimeout(() => {
        setActiveCrystal(null);
      }, step * 520 + 340);
      timersRef.current.push(t1, t2);
    });

    const tEnd = window.setTimeout(() => {
      setPlayingDemo(false);
      setStatus('Теперь твоя очередь — нажми 4 кристалла!');
    }, targetSeq.length * 520 + 120);
    timersRef.current.push(tEnd);
  };

  const handleCrystalTap = (id: number) => {
    if (playingDemo || completed) return;
    setActiveCrystal(id);
    playTone(crystals[id].freq, 0.3, 'triangle', soundEnabled, 0.16);
    setTimeout(() => setActiveCrystal(null), 220);

    const expected = targetSeq[userSeq.length];
    if (id === expected) {
      const next = [...userSeq, id];
      setUserSeq(next);
      if (next.length === targetSeq.length) {
        setStatus('Великолепно! Песня книги вернулась.');
        playSuccessFanfare(soundEnabled);
        onComplete(8, 'echo_crystal');
      } else {
        setStatus(`Верно (${next.length} / 4)! Продолжай.`);
      }
    } else {
      playErrorSound(soundEnabled);
      setUserSeq([]);
      setStatus('Ой, нота сбилась. Послушай мелодию ещё раз или начни с первого кристалла.');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={playDemo}
          disabled={playingDemo}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-indigo-950 font-semibold text-sm hover:bg-amber-300 disabled:opacity-60 cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          {playingDemo ? 'Звучит мелодия...' : 'Послушать мелодию'}
        </button>

        <span className="text-xs font-code opacity-80">Ноты: {userSeq.length} / 4</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {crystals.map((c) => {
          const isLit = activeCrystal === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCrystalTap(c.id)}
              className={`h-16 rounded-xl font-semibold text-sm transition-transform cursor-pointer border-2 ${
                c.color
              } ${
                isLit
                  ? 'scale-105 border-white shadow-[0_0_24px_rgba(255,255,255,0.65)]'
                  : 'border-transparent opacity-85 hover:opacity-100'
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      <p className="text-sm">{status}</p>

      {completed && (
        <div className="flex items-center gap-3 p-2.5 rounded-lg border border-amber-400/40 bg-amber-500/10 text-xs">
          <ArtifactIconSvg id="echo_crystal" className="w-7 h-7 shrink-0" />
          <span>Получен артефакт: Кристалл Поющего Эха.</span>
        </div>
      )}
    </div>
  );
}

/* Страница 9: Поймай светлячков-слов и восстанови стих */
export function FireflyWordsQuest({
  completed,
  soundEnabled,
  onComplete,
}: QuestProps) {
  const answerOrder = ['свет', 'друга', 'звёзды', 'мечте'];
  const wordBank = ['друга', 'камень', 'свет', 'мечте', 'туча', 'звёзды'];

  const [filled, setFilled] = useState<string[]>(completed ? answerOrder : []);
  const [hintMsg, setHintMsg] = useState(
    completed ? 'Стихотворение светится целиком!' : 'Нажимай на светлячков по смыслу строк:',
  );

  const handleWordClick = (word: string) => {
    if (completed || filled.length >= answerOrder.length) return;
    const expected = answerOrder[filled.length];
    if (word === expected) {
      const next = [...filled, word];
      setFilled(next);
      playSparkleSound(soundEnabled);
      if (next.length === answerOrder.length) {
        setHintMsg('Бумажный мост засиял!');
        playSuccessFanfare(soundEnabled);
        onComplete(9);
      } else {
        setHintMsg('Точно! Ищи следующее слово.');
      }
    } else {
      playErrorSound(soundEnabled);
      setHintMsg(`Слово «${word}» не подходит для следующего пропуска.`);
    }
  };

  const resetWords = () => {
    setFilled([]);
    setHintMsg('Попробуй собрать стих заново.');
  };

  const slot = (idx: number) => (
    <span
      className={`inline-block min-w-[70px] px-2 py-0.5 mx-1 rounded border text-center font-semibold ${
        filled[idx]
          ? 'border-amber-400 bg-amber-400/20 text-amber-600 dark:text-amber-300'
          : 'border-dashed border-current/40 opacity-60'
      }`}
    >
      {filled[idx] || '______'}
    </span>
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="p-3.5 rounded-xl border border-current/15 bg-black/5 dark:bg-white/5 text-sm leading-loose">
        <p>Когда в ночи погаснет {slot(0)},</p>
        <p>Сквозь космос позови ты {slot(1)}.</p>
        <p>Покажут путь живые {slot(2)}</p>
        <p>Навстречу сказочной {slot(3)}!</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {wordBank.map((w) => {
          const used = filled.includes(w);
          return (
            <button
              key={w}
              type="button"
              disabled={used || completed}
              onClick={() => handleWordClick(w)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                used
                  ? 'opacity-35 border-current/15 line-through'
                  : 'border-amber-400/60 bg-amber-400/15 hover:bg-amber-400/30'
              }`}
            >
              {w}
            </button>
          );
        })}
        {!completed && filled.length > 0 && (
          <button
            type="button"
            onClick={resetWords}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs border border-current/20 opacity-75 hover:opacity-100 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Сброс
          </button>
        )}
      </div>

      <p className="text-xs opacity-85">{hintMsg}</p>
      {completed && (
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-300">
          <ZvyozdikSvg className="w-6 h-6" glow={false} />
          <LuniSvg className="w-6 h-6" glow={false} />
          <span>Мост дружбы готов!</span>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Flame,
  Rocket,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { ArtifactId, ConstellationStar } from '../../types/book';
import { ARTIFACTS } from '../../data/storyPages';
import {
  playErrorSound,
  playMechanicalClick,
  playRocketLaunchSound,
  playSparkleSound,
  playSuccessFanfare,
  playTone,
} from '../../utils/audio';
import { ArtifactIconSvg, LuniSvg, ZvyozdikSvg } from '../Characters';
import type { QuestProps } from './QuestsPart1';

/* Страница 10: Сканер 4 планет — найди Луни */
export function PlanetScannerQuest({
  completed,
  soundEnabled,
  onComplete,
}: QuestProps) {
  const [selected, setSelected] = useState<string | null>(completed ? 'ringed' : null);
  const [message, setMessage] = useState(
    completed
      ? 'Верно! Луни ждал тебя на Лазурной планете с золотым кольцом!'
      : 'Нажми на планету, чтобы просканировать её.',
  );

  const planets = [
    { id: 'lava', name: 'Огненная', ok: false },
    { id: 'ringed', name: 'Лазурная с кольцом', ok: true },
    { id: 'green', name: 'Изумрудная', ok: false },
    { id: 'crystal', name: 'Лунный кристалл', ok: false },
  ];

  const handlePick = (id: string, ok: boolean) => {
    setSelected(id);
    if (ok) {
      setMessage('Ура! Луни машет тебе из кратера планеты с кольцом!');
      playSuccessFanfare(soundEnabled);
      if (!completed) onComplete(10);
    } else {
      playErrorSound(soundEnabled);
      setMessage('На этой планете никого нет. Вспомни подсказку про золотой обруч!');
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {planets.map((p) => {
          const isChosen = selected === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePick(p.id, p.ok)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-transform hover:scale-[1.03] cursor-pointer ${
                isChosen && p.ok
                  ? 'border-emerald-400 bg-emerald-500/15'
                  : isChosen
                    ? 'border-rose-400 bg-rose-500/10'
                    : 'border-current/20 hover:border-amber-400'
              }`}
            >
              <svg viewBox="0 0 80 80" className="w-16 h-16">
                {p.id === 'lava' && (
                  <g>
                    <circle cx="40" cy="40" r="24" fill="#ef4444" />
                    <circle cx="32" cy="34" r="5" fill="#991b1b" />
                    <circle cx="49" cy="48" r="6" fill="#fb923c" />
                  </g>
                )}
                {p.id === 'ringed' && (
                  <g>
                    <ellipse cx="40" cy="42" rx="35" ry="9" fill="none" stroke="#fbbf24" strokeWidth="4" />
                    <circle cx="40" cy="40" r="20" fill="#0ea5e9" />
                    <path d="M23 36 Q40 44 57 36" stroke="#bae6fd" strokeWidth="2.5" fill="none" />
                  </g>
                )}
                {p.id === 'green' && (
                  <g>
                    <circle cx="40" cy="40" r="24" fill="#22c55e" />
                    <rect x="19" y="30" width="42" height="5" rx="2" fill="#15803d" />
                    <rect x="22" y="45" width="36" height="5" rx="2" fill="#15803d" />
                  </g>
                )}
                {p.id === 'crystal' && (
                  <g>
                    <polygon points="40,12 62,36 52,66 28,66 18,36" fill="#a78bfa" />
                    <polygon points="40,12 62,36 40,52" fill="#7c3aed" opacity="0.5" />
                  </g>
                )}
              </svg>
              <span className="text-xs font-medium">{p.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 min-h-[48px]">
        {(completed || selected === 'ringed') && <LuniSvg className="w-11 h-11 shrink-0" />}
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

/* Страница 11: Canvas-стирание звёздной пыли с линзы */
export function DustWipeQuest({
  completed,
  soundEnabled,
  onComplete,
}: QuestProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [clearedPct, setClearedPct] = useState(completed ? 100 : 0);
  const drawingRef = useRef(false);
  const checkTickRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || completed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw speckled cosmic dust texture
    for (let i = 0; i < 240; i++) {
      ctx.fillStyle = i % 3 === 0 ? '#94a3b8' : '#334155';
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1.5 + Math.random() * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#f8fafc';
    ctx.font = '600 14px Lora, serif';
    ctx.textAlign = 'center';
    ctx.fillText('Протри пыль пальцем или мышкой', canvas.width / 2, canvas.height / 2);
  }, [completed]);

  const wipeAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || completed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    checkTickRef.current += 1;
    if (checkTickRef.current % 4 === 0) {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0;
      const step = 16;
      for (let i = 3; i < data.length; i += 4 * step) {
        if (data[i] < 40) transparent++;
      }
      const totalSampled = Math.floor(data.length / (4 * step));
      const pct = Math.min(100, Math.round((transparent / totalSampled) * 100));
      setClearedPct(pct);

      if (pct >= 62 && !completed) {
        setClearedPct(100);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        playSuccessFanfare(soundEnabled);
        onComplete(11);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs font-code opacity-80">
        <span>Очистка телескопа</span>
        <span>Очищено: {clearedPct}%</span>
      </div>

      <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-indigo-400/50 bg-[#0d1136] select-none touch-none">
        {/* Revealed secret map underneath */}
        <svg viewBox="0 0 320 180" className="w-full h-full block">
          <circle cx="52" cy="128" r="16" fill="#0ea5e9" />
          <ellipse cx="52" cy="128" rx="28" ry="7" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
          <path d="M76 118 Q155 40 258 58" fill="none" stroke="#fde047" strokeWidth="3" strokeDasharray="6 5" />
          <polygon points="262,58 248,50 251,66" fill="#fde047" />
          <text x="160" y="150" textAnchor="middle" fill="#fde047" fontSize="13" fontWeight="bold">
            Маршрут кометы: Млечный Лабиринт →
          </text>
        </svg>

        {!completed && (
          <canvas
            ref={canvasRef}
            width={320}
            height={180}
            onPointerDown={(e) => {
              drawingRef.current = true;
              wipeAt(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (drawingRef.current) wipeAt(e.clientX, e.clientY);
            }}
            onPointerUp={() => {
              drawingRef.current = false;
            }}
            onPointerLeave={() => {
              drawingRef.current = false;
            }}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          />
        )}
      </div>

      <p className="text-xs opacity-80">
        {completed
          ? 'Линза блестит! Путь через Млечный Лабиринт открыт.'
          : 'Протри стекло минимум на 62%, чтобы увидеть весь маршрут.'}
      </p>
    </div>
  );
}

/* Страница 12: Космический лабиринт 6×6 */
export function MilkyWayMazeQuest({
  completed,
  soundEnabled,
  onComplete,
}: QuestProps) {
  // 0=free, 1=meteoroid wall
  const grid = [
    [0, 0, 1, 0, 0, 0],
    [1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 0],
    [0, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 0],
    [1, 0, 0, 0, 0, 0],
  ];
  const featherPos = { r: 2, c: 0 };
  const exitPos = { r: 5, c: 5 };

  const [pos, setPos] = useState(completed ? exitPos : { r: 0, c: 0 });
  const [hasFeather, setHasFeather] = useState(completed);

  const move = (dr: number, dc: number) => {
    if (completed) return;
    const nr = pos.r + dr;
    const nc = pos.c + dc;
    if (nr < 0 || nr >= 6 || nc < 0 || nc >= 6 || grid[nr][nc] === 1) {
      playErrorSound(soundEnabled);
      return;
    }
    playTone(540, 0.08, 'sine', soundEnabled, 0.08);
    setPos({ r: nr, c: nc });

    let featherNow = hasFeather;
    if (nr === featherPos.r && nc === featherPos.c && !hasFeather) {
      featherNow = true;
      setHasFeather(true);
      playSparkleSound(soundEnabled);
    }

    if (nr === exitPos.r && nc === exitPos.c && featherNow) {
      playSuccessFanfare(soundEnabled);
      onComplete(12, 'luni_feather');
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-between w-full text-xs font-code opacity-85">
        <span>Перо Луни: {hasFeather ? 'Собрано' : 'Нужно забрать'}</span>
        <span>Цель: Портал</span>
      </div>

      <div className="grid grid-cols-6 gap-1.5 p-2.5 rounded-xl bg-[#0b0e2d] border border-indigo-400/35">
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const isPlayer = pos.r === r && pos.c === c;
            const isFeather = !hasFeather && featherPos.r === r && featherPos.c === c;
            const isExit = exitPos.r === r && exitPos.c === c;
            return (
              <div
                key={`${r}-${c}`}
                className={`w-9 h-9 rounded-md flex items-center justify-center text-xs font-bold ${
                  cell === 1
                    ? 'bg-slate-700/90 border border-slate-600 text-slate-400'
                    : isExit
                      ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-300'
                      : 'bg-indigo-950/80 border border-indigo-800/60'
                }`}
              >
                {isPlayer ? (
                  <span className="text-amber-300">★</span>
                ) : isFeather ? (
                  <span className="text-sky-300">🪶</span>
                ) : isExit ? (
                  <span>◎</span>
                ) : cell === 1 ? (
                  <span>●</span>
                ) : null}
              </div>
            );
          }),
        )}
      </div>

      {/* Directional Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Влево"
          onClick={() => move(0, -1)}
          className="p-2.5 rounded-lg border border-current/25 hover:border-amber-400 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            aria-label="Вверх"
            onClick={() => move(-1, 0)}
            className="p-2.5 rounded-lg border border-current/25 hover:border-amber-400 cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Вниз"
            onClick={() => move(1, 0)}
            className="p-2.5 rounded-lg border border-current/25 hover:border-amber-400 cursor-pointer"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
        <button
          type="button"
          aria-label="Вправо"
          onClick={() => move(0, 1)}
          className="p-2.5 rounded-lg border border-current/25 hover:border-amber-400 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        {!completed && (
          <button
            type="button"
            onClick={() => {
              setPos({ r: 0, c: 0 });
              setHasFeather(false);
            }}
            className="ml-2 p-2.5 rounded-lg border border-current/20 opacity-75 hover:opacity-100 cursor-pointer"
            title="Сбросить позицию"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {completed && (
        <div className="flex items-center gap-3 p-2.5 rounded-lg border border-amber-400/40 bg-amber-500/10 text-xs w-full">
          <ArtifactIconSvg id="luni_feather" className="w-7 h-7 shrink-0" />
          <span>Лабиринт пройден! Получено Серебряное Перо Луни.</span>
        </div>
      )}
    </div>
  );
}

/* Страница 13: Тройной кодовый барабан Хранителя */
export function LibraryCipherQuest({
  completed,
  soundEnabled,
  onComplete,
}: QuestProps) {
  const symbols = ['Звезда', 'Солнце', 'Луна', 'Комета', 'Книга'];
  const target = [0, 2, 4]; // Звезда, Луна, Книга

  const [dials, setDials] = useState<[number, number, number]>(
    completed ? [0, 2, 4] : [1, 3, 1],
  );
  const [msg, setMsg] = useState(
    completed
      ? 'Шифр совпал! Врата Звёздной Библиотеки распахнуты.'
      : 'Подбери три главных символа сказки и нажми «Проверить».',
  );

  const cycleDial = (idx: 0 | 1 | 2) => {
    if (completed) return;
    playMechanicalClick(soundEnabled);
    const next: [number, number, number] = [...dials] as [number, number, number];
    next[idx] = (next[idx] + 1) % symbols.length;
    setDials(next);
  };

  const checkCipher = () => {
    if (dials[0] === target[0] && dials[1] === target[1] && dials[2] === target[2]) {
      setMsg('Верно! Механический Филин пропустил друзей внутрь!');
      playSuccessFanfare(soundEnabled);
      if (!completed) onComplete(13);
    } else {
      playErrorSound(soundEnabled);
      setMsg('Пока неверно. Вспомни: 1) Кто прилетел с неба, 2) Имя друга, 3) Волшебный предмет.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2.5">
        {dials.map((val, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => cycleDial(idx as 0 | 1 | 2)}
            className="flex flex-col items-center justify-center gap-1 py-4 px-2 rounded-xl border-2 border-indigo-400/40 bg-[#101438] text-amber-200 hover:border-amber-400 transition-colors cursor-pointer"
          >
            <span className="text-[11px] uppercase tracking-wider opacity-60">Диск {idx + 1}</span>
            <span className="font-display font-bold text-base">{symbols[val]}</span>
            <span className="text-[11px] opacity-60">Нажми</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={checkCipher}
        className="w-full py-2.5 px-4 rounded-lg bg-amber-400 text-indigo-950 font-semibold text-sm hover:bg-amber-300 transition-colors cursor-pointer"
      >
        Проверить шифр Хранителя
      </button>

      <p className="text-sm">{msg}</p>
    </div>
  );
}

/* Страница 14: Алхимия живых чернил */
export function StoryAlchemyQuest({
  completed,
  soundEnabled,
  onComplete,
}: QuestProps) {
  const flasks = [
    { id: 'dew', label: 'Лунная роса', color: 'bg-sky-400' },
    { id: 'dust', label: 'Пыльца кометы', color: 'bg-amber-400' },
    { id: 'spark', label: 'Искра мечты', color: 'bg-violet-400' },
  ];

  const [added, setAdded] = useState<string[]>(completed ? ['dew', 'dust', 'spark'] : []);

  const pourFlask = (id: string) => {
    if (added.includes(id)) return;
    const next = [...added, id];
    setAdded(next);
    playSparkleSound(soundEnabled);
    if (next.length === 3 && !completed) {
      playSuccessFanfare(soundEnabled);
      onComplete(14);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-36 flex items-center justify-center">
        <svg viewBox="0 0 120 130" className="w-full h-full">
          <path
            d="M44 12 H76 V42 L106 104 C110 114 103 122 92 122 H28 C17 122 10 114 14 104 L44 42 Z"
            fill="#0f172a"
            stroke="#bae6fd"
            strokeWidth="3"
          />
          {added.length >= 1 && (
            <path d="M22 100 H98 L104 108 C106 115 100 120 92 120 H28 C20 120 14 115 16 108 Z" fill="#38bdf8" />
          )}
          {added.length >= 2 && (
            <path d="M29 82 H91 L98 100 H22 Z" fill="#fbbf24" opacity="0.9" />
          )}
          {added.length >= 3 && (
            <path d="M36 64 H84 L91 82 H29 Z" fill="#a78bfa" opacity="0.95" />
          )}
          {added.length === 3 && (
            <g className="anim-twinkle">
              <circle cx="52" cy="86" r="3" fill="#fff" />
              <circle cx="68" cy="76" r="2.5" fill="#fff" />
              <circle cx="60" cy="98" r="3" fill="#fff" />
            </g>
          )}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full">
        {flasks.map((f) => {
          const used = added.includes(f.id);
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => pourFlask(f.id)}
              disabled={used}
              className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                used
                  ? 'border-emerald-400/50 bg-emerald-500/15 opacity-60'
                  : 'border-current/25 hover:border-amber-400'
              }`}
            >
              <span className={`w-4 h-4 rounded-full ${f.color}`} />
              <span className="text-center leading-tight">{used ? 'Влито ✓' : f.label}</span>
            </button>
          );
        })}
      </div>

      <p className="text-xs opacity-85 text-center">
        {added.length === 3
          ? 'Эликсир готов! Живые чернила напечатали чертёж ракеты.'
          : `Смешано эликсиров: ${added.length} из 3`}
      </p>
    </div>
  );
}

/* Страница 15: Сборка Ракеты Мечты */
export function RocketBuilderQuest({
  completed,
  soundEnabled,
  onComplete,
}: QuestProps) {
  const parts = [
    { id: 'engine', label: 'Плазменный двигатель' },
    { id: 'hull', label: 'Корпус с окном' },
    { id: 'wings', label: 'Боковые крылья' },
    { id: 'nose', label: 'Золотой нос' },
  ];

  const [installed, setInstalled] = useState<string[]>(
    completed ? ['engine', 'hull', 'wings', 'nose'] : [],
  );

  const installPart = (id: string) => {
    if (installed.includes(id)) return;
    const next = [...installed, id];
    setInstalled(next);
    playMechanicalClick(soundEnabled);
    if (next.length === 4 && !completed) {
      playSuccessFanfare(soundEnabled);
      onComplete(15, 'star_fuel');
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox="0 0 180 150" className="w-44 h-36 rounded-xl bg-[#0c122e] border border-sky-400/30">
        {/* Silhouette guide */}
        <path d="M90 16 Q112 46 106 108 L74 108 Q68 46 90 16 Z" fill="none" stroke="#38bdf8" strokeDasharray="4 4" strokeWidth="1.5" />

        {/* Wings */}
        {installed.includes('wings') && (
          <g>
            <polygon points="74,88 54,116 74,106" fill="#ef4444" />
            <polygon points="106,88 126,116 106,106" fill="#ef4444" />
          </g>
        )}

        {/* Hull */}
        {installed.includes('hull') && (
          <g>
            <rect x="74" y="48" width="32" height="60" rx="4" fill="#f8fafc" />
            <circle cx="90" cy="70" r="9" fill="#38bdf8" stroke="#4f46e5" strokeWidth="2.5" />
          </g>
        )}

        {/* Nose */}
        {installed.includes('nose') && (
          <path d="M90 14 Q106 34 106 50 L74 50 Q74 34 90 14 Z" fill="#fbbf24" />
        )}

        {/* Engine */}
        {installed.includes('engine') && (
          <g>
            <rect x="80" y="108" width="20" height="8" fill="#64748b" />
            <polygon points="82,116 90,136 98,116" fill="#f97316" className="anim-flame" />
          </g>
        )}
      </svg>

      <div className="grid grid-cols-2 gap-2 w-full">
        {parts.map((part) => {
          const done = installed.includes(part.id);
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => installPart(part.id)}
              disabled={done}
              className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                done
                  ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                  : 'border-current/25 hover:border-amber-400'
              }`}
            >
              {done ? `✓ ${part.label}` : `+ ${part.label}`}
            </button>
          );
        })}
      </div>

      {completed && (
        <div className="flex items-center gap-3 p-2.5 rounded-lg border border-amber-400/40 bg-amber-500/10 text-xs w-full">
          <ArtifactIconSvg id="star_fuel" className="w-7 h-7 shrink-0" />
          <span>Ракета собрана и заправлена Искрой Ракетного Пламени!</span>
        </div>
      )}
    </div>
  );
}

/* Страница 16: Обратный отсчёт и запуск ракеты */
export function RocketLaunchQuest({
  completed,
  soundEnabled,
  onComplete,
}: QuestProps) {
  const [launched, setLaunched] = useState(completed);
  const [countdown, setCountdown] = useState<number | null>(null);

  const startLaunch = () => {
    if (countdown !== null) return;
    if (launched) {
      setLaunched(false);
      return;
    }

    setCountdown(3);
    playTone(440, 0.18, 'triangle', soundEnabled, 0.14);

    setTimeout(() => {
      setCountdown(2);
      playTone(554, 0.18, 'triangle', soundEnabled, 0.14);
    }, 650);

    setTimeout(() => {
      setCountdown(1);
      playTone(659, 0.18, 'triangle', soundEnabled, 0.14);
    }, 1300);

    setTimeout(() => {
      setCountdown(null);
      setLaunched(true);
      playRocketLaunchSound(soundEnabled);
      if (!completed) onComplete(16);
    }, 1950);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full h-52 rounded-xl overflow-hidden bg-gradient-to-b from-[#080b28] to-[#2e2476] border border-indigo-400/35">
        <svg viewBox="0 0 300 190" className="w-full h-full block">
          <circle cx="40" cy="30" r="2" fill="#fff" className="anim-twinkle" />
          <circle cx="250" cy="26" r="2.5" fill="#fde047" className="anim-twinkle" />
          <circle cx="150" cy="22" r="2" fill="#fff" className="anim-twinkle" />
          <circle cx="150" cy="260" r="120" fill="#6366f1" />

          {/* Launchable Rocket */}
          <g
            style={{
              transform: launched ? 'translate(85px, -175px) rotate(18deg)' : 'translate(0px, 0px)',
              transition: 'transform 2.2s cubic-bezier(0.3, 0, 0.2, 1)',
            }}
          >
            <g transform="translate(120, 68)">
              <polygon points="15,66 0,88 15,80" fill="#ef4444" />
              <polygon points="45,66 60,88 45,80" fill="#ef4444" />
              <path d="M30 0 Q52 28 46 76 L14 76 Q8 28 30 0 Z" fill="#ffffff" />
              <circle cx="30" cy="36" r="9" fill="#38bdf8" stroke="#4f46e5" strokeWidth="3" />
              <path
                d="M20 78 L30 112 L40 78 Z"
                fill={launched || countdown !== null ? '#fbbf24' : '#f97316'}
                className="anim-flame"
              />
            </g>
          </g>
        </svg>

        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="font-display font-bold text-6xl text-amber-300 drop-shadow-lg">
              {countdown}
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={startLaunch}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-amber-400 text-indigo-950 font-bold text-sm hover:bg-amber-300 transition-colors cursor-pointer"
      >
        <Rocket className="w-4 h-4" />
        {countdown !== null
          ? 'Идёт запуск...'
          : launched
            ? 'Вернуть на стартовый стол'
            : 'Запустить ракету домой!'}
      </button>

      {launched && (
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300">
          Поехали! Звёздик и Луни летят к родному дому!
        </p>
      )}
    </div>
  );
}

/* Страница 17: Создай своё созвездие на память */
export function CustomConstellationQuest({
  completed,
  soundEnabled,
  stars,
  constellationName,
  onSaveConstellation,
  onComplete,
}: QuestProps & {
  stars: ConstellationStar[];
  constellationName: string;
  onSaveConstellation: (stars: ConstellationStar[], name: string) => void;
}) {
  const [localStars, setLocalStars] = useState<ConstellationStar[]>(stars);
  const [name, setName] = useState(constellationName);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 320);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 180);
    if (localStars.length >= 12) return;
    const next = [...localStars, { id: Date.now(), x, y }];
    setLocalStars(next);
    playTone(620 + next.length * 45, 0.16, 'triangle', soundEnabled, 0.12);
    onSaveConstellation(next, name);
  };

  const handleSave = () => {
    if (localStars.length < 4) {
      playErrorSound(soundEnabled);
      return;
    }
    onSaveConstellation(localStars, name.trim() || 'Созвездие Мечты');
    playSuccessFanfare(soundEnabled);
    if (!completed) onComplete(17);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs font-code opacity-80">
        <span>Кликни по небу (минимум 4 звезды)</span>
        <span>Звёзд: {localStars.length} / 12</span>
      </div>

      <svg
        viewBox="0 0 320 180"
        onClick={handleSvgClick}
        className="w-full h-44 rounded-xl bg-[#090d2a] border border-indigo-400/40 cursor-crosshair select-none"
      >
        {localStars.slice(0, -1).map((s, idx) => {
          const next = localStars[idx + 1];
          return (
            <line
              key={s.id}
              x1={s.x}
              y1={s.y}
              x2={next.x}
              y2={next.y}
              stroke="#fbbf24"
              strokeWidth="2"
              strokeOpacity="0.8"
            />
          );
        })}
        {localStars.map((s) => (
          <circle
            key={s.id}
            cx={s.x}
            cy={s.y}
            r="5.5"
            fill="#fde047"
            stroke="#ffffff"
            strokeWidth="1.2"
          />
        ))}
        {localStars.length === 0 && (
          <text x="160" y="94" textAnchor="middle" fill="#94a3b8" fontSize="13">
            Нажми сюда, чтобы поставить первую звезду
          </text>
        )}
      </svg>

      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            onSaveConstellation(localStars, e.target.value);
          }}
          placeholder="Название созвездия..."
          className="flex-1 min-w-[160px] px-3 py-2 rounded-lg border border-current/25 bg-transparent text-sm focus:outline-none focus:border-amber-400"
        />
        <button
          type="button"
          onClick={() => {
            setLocalStars([]);
            onSaveConstellation([], name);
          }}
          className="px-3 py-2 rounded-lg border border-current/25 text-xs hover:border-amber-400 cursor-pointer"
        >
          Очистить
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={localStars.length < 4}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 text-indigo-950 font-semibold text-sm hover:bg-amber-300 disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Вписать в книгу
        </button>
      </div>
    </div>
  );
}

/* Страница 18: Этикетка работы и Диплом Первооткрывателя */
export function ExplorerDiplomaPage({
  completedQuests,
  artifacts,
  readerName,
  constellationStars,
  constellationName,
  onChangeReaderName,
  onResetAdventure,
}: {
  completedQuests: number[];
  artifacts: ArtifactId[];
  readerName: string;
  constellationStars: ConstellationStar[];
  constellationName: string;
  onChangeReaderName: (val: string) => void;
  onResetAdventure: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Диплом читателя */}
      <div className="p-4 rounded-xl border-2 border-amber-400/50 bg-amber-500/10 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display font-bold text-lg">Диплом Первооткрывателя</h3>
          <span className="font-code text-xs font-medium">
            Квесты: {completedQuests.length} / 17
          </span>
        </div>

        <label className="flex flex-col gap-1 text-xs">
          <span className="opacity-75">Имя читателя-исследователя:</span>
          <input
            type="text"
            value={readerName}
            onChange={(e) => onChangeReaderName(e.target.value)}
            placeholder="Впиши своё имя..."
            className="px-3 py-2 rounded-lg border border-current/25 bg-white/60 dark:bg-black/25 text-sm font-medium focus:outline-none focus:border-amber-400"
          />
        </label>

        {/* Mini constellation + artifacts count */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="text-xs leading-relaxed">
            <div>
              Созвездие:{' '}
              <span className="font-semibold">
                {constellationName || 'Не названо'}
              </span>
            </div>
            <div>
              Артефакты: <span className="font-code font-semibold">{artifacts.length} / 6</span>
            </div>
          </div>

          {constellationStars.length > 0 && (
            <svg viewBox="0 0 320 180" className="w-24 h-14 rounded-lg bg-[#090d2a] border border-amber-400/40 shrink-0">
              {constellationStars.slice(0, -1).map((s, idx) => (
                <line
                  key={s.id}
                  x1={s.x}
                  y1={s.y}
                  x2={constellationStars[idx + 1].x}
                  y2={constellationStars[idx + 1].y}
                  stroke="#fbbf24"
                  strokeWidth="3"
                />
              ))}
              {constellationStars.map((s) => (
                <circle key={s.id} cx={s.x} cy={s.y} r="7" fill="#fde047" />
              ))}
            </svg>
          )}
        </div>

        {/* Collected artifacts row */}
        <div className="flex flex-wrap gap-2 pt-1">
          {(Object.keys(ARTIFACTS) as ArtifactId[]).map((id) => {
            const has = artifacts.includes(id);
            return (
              <div
                key={id}
                title={ARTIFACTS[id].name}
                className={`p-1.5 rounded-lg border ${
                  has
                    ? 'border-amber-400/60 bg-amber-400/15'
                    : 'border-current/15 opacity-25 grayscale'
                }`}
              >
                <ArtifactIconSvg id={id} className="w-6 h-6" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Этикетка работы (из оригинала пользователя) */}
      <div className="p-3.5 rounded-xl border border-current/20 text-xs leading-relaxed space-y-1">
        <div className="font-display font-bold text-sm mb-1">Этикетка работы</div>
        <div>
          <span className="font-semibold">Название работы:</span> «Звёздик и Книга-Звезда»
        </div>
        <div>
          <span className="font-semibold">Описание идеи:</span> Книга будущего, которая светится в темноте, оживляет иллюстрации и хранит 18 страниц квестов, тайн и мини-игр.
        </div>
        <div>
          <span className="font-semibold">Участник:</span> Калимов Ильдар · 4 «В» класс
        </div>
        <div>
          <span className="font-semibold">Образовательная организация:</span> «Smart Bilim»
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium">
          <ZvyozdikSvg className="w-7 h-7" glow={false} />
          <LuniSvg className="w-6 h-6" glow={false} />
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Спасибо за прочтение!</span>
        </div>
        <button
          type="button"
          onClick={onResetAdventure}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-current/25 text-xs font-medium hover:border-amber-400 cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Начать заново
        </button>
      </div>
    </div>
  );
}

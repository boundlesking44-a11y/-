import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { STORY_PAGES } from './data/storyPages';
import type { ArtifactId, BookProgress, ConstellationStar } from './types/book';
import { playPageFlipSound } from './utils/audio';
import { StarfieldBackground } from './components/StarfieldBackground';
import { BookSpread } from './components/BookSpread';
import { AboutBookDrawer, ArtifactsDrawer, ChaptersDrawer } from './components/Drawers';

const STORAGE_KEY = 'kniga-zvezda-progress-v1';

const DEFAULT_PROGRESS: BookProgress = {
  currentPage: 1,
  nightGlow: false,
  soundEnabled: true,
  completedQuests: [],
  artifacts: [],
  readerName: '',
  customConstellation: [],
  constellationName: 'Звёздный Путь',
  visitedPages: [1],
};

function loadProgress(): BookProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<BookProgress>;
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      currentPage: Math.max(1, Math.min(STORY_PAGES.length, parsed.currentPage ?? 1)),
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export default function App() {
  const [progress, setProgress] = useState<BookProgress>(loadProgress);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [activeDrawer, setActiveDrawer] = useState<'chapters' | 'artifacts' | 'about' | null>(null);

  const pageIndex = progress.currentPage - 1;
  const currentPageData = STORY_PAGES[pageIndex] ?? STORY_PAGES[0];

  // Sync nightGlow with <html>.dark and persist state
  useEffect(() => {
    document.documentElement.classList.toggle('dark', progress.nightGlow);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
  }, [progress]);

  const goToPage = useCallback(
    (targetPage: number) => {
      const clamped = Math.max(1, Math.min(STORY_PAGES.length, targetPage));
      if (clamped === progress.currentPage) return;

      setDirection(clamped > progress.currentPage ? 1 : -1);
      playPageFlipSound(progress.soundEnabled);

      setProgress((prev) => ({
        ...prev,
        currentPage: clamped,
        visitedPages: prev.visitedPages.includes(clamped)
          ? prev.visitedPages
          : [...prev.visitedPages, clamped],
      }));
    },
    [progress.currentPage, progress.soundEnabled],
  );

  const handleNext = useCallback(() => {
    goToPage(progress.currentPage + 1);
  }, [goToPage, progress.currentPage]);

  const handlePrev = useCallback(() => {
    goToPage(progress.currentPage - 1);
  }, [goToPage, progress.currentPage]);

  // Keyboard arrow navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (activeDrawer) {
        if (e.key === 'Escape') setActiveDrawer(null);
        return;
      }
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeDrawer, handleNext, handlePrev]);

  const handleCompleteQuest = useCallback((pageId: number, artifact?: ArtifactId) => {
    setProgress((prev) => {
      const nextQuests = prev.completedQuests.includes(pageId)
        ? prev.completedQuests
        : [...prev.completedQuests, pageId];
      const nextArtifacts =
        artifact && !prev.artifacts.includes(artifact)
          ? [...prev.artifacts, artifact]
          : prev.artifacts;
      return {
        ...prev,
        completedQuests: nextQuests,
        artifacts: nextArtifacts,
      };
    });
  }, []);

  const handleToggleNightGlow = useCallback(() => {
    setProgress((prev) => ({ ...prev, nightGlow: !prev.nightGlow }));
  }, []);

  const handleToggleSound = useCallback(() => {
    setProgress((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const handleSaveConstellation = useCallback(
    (stars: ConstellationStar[], name: string) => {
      setProgress((prev) => ({
        ...prev,
        customConstellation: stars,
        constellationName: name,
      }));
    },
    [],
  );

  const handleChangeReaderName = useCallback((readerName: string) => {
    setProgress((prev) => ({ ...prev, readerName }));
  }, []);

  const handleResetAdventure = useCallback(() => {
    setDirection(-1);
    setProgress({
      ...DEFAULT_PROGRESS,
      nightGlow: progress.nightGlow,
      soundEnabled: progress.soundEnabled,
    });
  }, [progress.nightGlow, progress.soundEnabled]);

  const progressPct = Math.round((progress.currentPage / STORY_PAGES.length) * 100);

  return (
    <div className="relative min-h-screen flex flex-col text-[#f6efe0]">
      <StarfieldBackground nightGlow={progress.nightGlow} />

      {/* Top Bar Contract: Brand wordmark — 4 nav text links — 1 primary action */}
      <header className="relative z-20 w-full border-b border-white/10 bg-[#0b0e24]/65 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => goToPage(1)}
            className="font-display font-bold text-lg sm:text-xl tracking-tight text-amber-200 whitespace-nowrap shrink-0 cursor-pointer hover:text-amber-100"
          >
            Книга-Звезда
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-200">
            <button
              type="button"
              onClick={() => setActiveDrawer('chapters')}
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Карта квестов
            </button>
            <button
              type="button"
              onClick={() => setActiveDrawer('artifacts')}
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Артефакты ({progress.artifacts.length}/6)
            </button>
            <button
              type="button"
              onClick={handleToggleSound}
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {progress.soundEnabled ? 'Звук включён' : 'Звук выключен'}
            </button>
            <button
              type="button"
              onClick={() => setActiveDrawer('about')}
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              О книге
            </button>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleToggleNightGlow}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                progress.nightGlow
                  ? 'bg-amber-400 text-indigo-950 hover:bg-amber-300'
                  : 'bg-white/12 text-amber-100 border border-amber-300/30 hover:bg-white/20'
              }`}
            >
              {progress.nightGlow ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{progress.nightGlow ? 'Дневной свет' : 'Ночной свет'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Book Stage */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 py-5 sm:py-7 gap-5">
        {/* Compact unboxed progress & mobile quick-links */}
        <div className="max-w-[1120px] w-full mx-auto flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <span>
              {currentPageData.chapterLabel} · Страница {progress.currentPage} из{' '}
              {STORY_PAGES.length} · Квесты: {progress.completedQuests.length} / 17
            </span>
            <div className="flex md:hidden items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveDrawer('chapters')}
                className="underline text-amber-200 cursor-pointer"
              >
                Карта
              </button>
              <button
                type="button"
                onClick={() => setActiveDrawer('artifacts')}
                className="underline text-amber-200 cursor-pointer"
              >
                Сумка ({progress.artifacts.length}/6)
              </button>
              <button
                type="button"
                onClick={handleToggleSound}
                aria-label="Переключить звук"
                className="text-amber-200 cursor-pointer"
              >
                {progress.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-transform duration-300 origin-left"
              style={{ transform: `scaleX(${progressPct / 100})` }}
            />
          </div>
        </div>

        <BookSpread
          page={currentPageData}
          direction={direction}
          nightGlow={progress.nightGlow}
          soundEnabled={progress.soundEnabled}
          completedQuests={progress.completedQuests}
          artifacts={progress.artifacts}
          readerName={progress.readerName}
          customConstellation={progress.customConstellation}
          constellationName={progress.constellationName}
          onCompleteQuest={handleCompleteQuest}
          onToggleNightGlow={handleToggleNightGlow}
          onNextPage={handleNext}
          onPrevPage={handlePrev}
          onSaveConstellation={handleSaveConstellation}
          onChangeReaderName={handleChangeReaderName}
          onResetAdventure={handleResetAdventure}
        />

        {/* Bottom Book Reading Controls */}
        <div className="max-w-[1120px] w-full mx-auto flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handlePrev}
              disabled={progress.currentPage <= 1}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:pointer-events-none text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              <ChevronLeft className="w-4 h-4" />
              Назад
            </button>

            <span className="font-code text-sm px-3 text-amber-200 whitespace-nowrap">
              {progress.currentPage} / {STORY_PAGES.length}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={progress.currentPage >= STORY_PAGES.length}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-amber-400 text-indigo-950 hover:bg-amber-300 disabled:opacity-35 disabled:pointer-events-none text-sm font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              Дальше
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>Листай стрелками ← → или свайпом</span>
          </div>
        </div>
      </main>

      {/* Slide-over Drawers */}
      {activeDrawer === 'chapters' && (
        <ChaptersDrawer
          currentPage={progress.currentPage}
          completedQuests={progress.completedQuests}
          onSelectPage={goToPage}
          onClose={() => setActiveDrawer(null)}
        />
      )}

      {activeDrawer === 'artifacts' && (
        <ArtifactsDrawer
          artifacts={progress.artifacts}
          onJumpToPage={goToPage}
          onClose={() => setActiveDrawer(null)}
        />
      )}

      {activeDrawer === 'about' && (
        <AboutBookDrawer onClose={() => setActiveDrawer(null)} />
      )}
    </div>
  );
}

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, HelpCircle } from 'lucide-react';
import type { ArtifactId, ConstellationStar, StoryPage } from '../types/book';
import { SceneIllustration } from './SceneIllustrations';
import {
  AstrolabeQuest,
  ConstellationWakeQuest,
  CoverWaxSealQuest,
  EchoMelodyQuest,
  FireflyWordsQuest,
  LivingPlanetDiorama,
  SecretFlapQuest,
  SecretPocketQuest,
  UvMagnifierQuest,
} from './quests/QuestsPart1';
import {
  CustomConstellationQuest,
  DustWipeQuest,
  ExplorerDiplomaPage,
  LibraryCipherQuest,
  MilkyWayMazeQuest,
  PlanetScannerQuest,
  RocketBuilderQuest,
  RocketLaunchQuest,
  StoryAlchemyQuest,
} from './quests/QuestsPart2';

interface BookSpreadProps {
  page: StoryPage;
  direction: 1 | -1;
  nightGlow: boolean;
  soundEnabled: boolean;
  completedQuests: number[];
  artifacts: ArtifactId[];
  readerName: string;
  customConstellation: ConstellationStar[];
  constellationName: string;
  onCompleteQuest: (pageId: number, artifact?: ArtifactId) => void;
  onToggleNightGlow: () => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  onSaveConstellation: (stars: ConstellationStar[], name: string) => void;
  onChangeReaderName: (name: string) => void;
  onResetAdventure: () => void;
}

export function BookSpread({
  page,
  direction,
  nightGlow,
  soundEnabled,
  completedQuests,
  artifacts,
  readerName,
  customConstellation,
  constellationName,
  onCompleteQuest,
  onToggleNightGlow,
  onNextPage,
  onPrevPage,
  onSaveConstellation,
  onChangeReaderName,
  onResetAdventure,
}: BookSpreadProps) {
  const [showHint, setShowHint] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const isCompleted = completedQuests.includes(page.id);
  const paperClass = nightGlow ? 'paper-night' : 'paper-day';

  const questProps = {
    pageId: page.id,
    completed: isCompleted,
    nightGlow,
    soundEnabled,
    artifacts,
    onComplete: onCompleteQuest,
    onToggleNightGlow,
    onNextPage,
  };

  const renderQuest = () => {
    switch (page.id) {
      case 1:
        return <CoverWaxSealQuest {...questProps} />;
      case 2:
        return <UvMagnifierQuest {...questProps} />;
      case 3:
        return <LivingPlanetDiorama {...questProps} />;
      case 4:
        return <ConstellationWakeQuest {...questProps} />;
      case 5:
        return <SecretPocketQuest {...questProps} />;
      case 6:
        return <SecretFlapQuest {...questProps} />;
      case 7:
        return <AstrolabeQuest {...questProps} />;
      case 8:
        return <EchoMelodyQuest {...questProps} />;
      case 9:
        return <FireflyWordsQuest {...questProps} />;
      case 10:
        return <PlanetScannerQuest {...questProps} />;
      case 11:
        return <DustWipeQuest {...questProps} />;
      case 12:
        return <MilkyWayMazeQuest {...questProps} />;
      case 13:
        return <LibraryCipherQuest {...questProps} />;
      case 14:
        return <StoryAlchemyQuest {...questProps} />;
      case 15:
        return <RocketBuilderQuest {...questProps} />;
      case 16:
        return <RocketLaunchQuest {...questProps} />;
      case 17:
        return (
          <CustomConstellationQuest
            {...questProps}
            stars={customConstellation}
            constellationName={constellationName}
            onSaveConstellation={onSaveConstellation}
          />
        );
      case 18:
        return (
          <ExplorerDiplomaPage
            completedQuests={completedQuests}
            artifacts={artifacts}
            readerName={readerName}
            constellationStars={customConstellation}
            constellationName={constellationName}
            onChangeReaderName={onChangeReaderName}
            onResetAdventure={onResetAdventure}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="relative w-full max-w-[1120px] mx-auto perspective-1000"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
        const delta = endX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(delta) > 75) {
          if (delta < 0) onNextPage();
          else onPrevPage();
        }
      }}
    >
      {/* Hardcover Binding Frame */}
      <div
        className={`relative rounded-2xl p-2 sm:p-3.5 border transition-colors duration-500 shadow-[0_24px_60px_rgba(0,0,0,0.65)] ${
          nightGlow
            ? 'bg-gradient-to-br from-[#1f1a54] via-[#14113a] to-[#0b0924] border-amber-300/30 shadow-[0_0_45px_rgba(251,191,36,0.18),0_24px_60px_rgba(0,0,0,0.75)]'
            : 'bg-gradient-to-br from-[#342a80] via-[#221b5c] to-[#161142] border-indigo-300/25'
        }`}
      >
        {/* Decorative Bookmark Ribbon */}
        <div
          aria-hidden="true"
          className="hidden sm:block absolute -bottom-5 right-14 w-5 h-9 bg-gradient-to-b from-amber-400 to-amber-600 rounded-b-sm shadow-md z-0"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)' }}
        />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page.id}
            initial={{
              opacity: 0,
              rotateY: direction > 0 ? 12 : -12,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              rotateY: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              rotateY: direction > 0 ? -12 : 12,
              scale: 0.985,
            }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 grid grid-cols-1 lg:grid-cols-2 rounded-xl overflow-hidden border border-black/15"
          >
            {/* LEFT FOLIO: Fairytale Narrative & Scene */}
            <section
              aria-label="Текст сказки"
              className={`relative ${paperClass} p-5 sm:p-8 lg:min-h-[560px] flex flex-col justify-between gap-5 transition-colors duration-500 border-b lg:border-b-0 lg:border-r ${
                nightGlow ? 'border-amber-200/15' : 'border-stone-900/15'
              }`}
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 spine-shadow-left" />

              <div className="relative z-10 space-y-4">
                {/* Quiet unboxed metadata header */}
                <div className="flex items-center justify-between gap-2 text-xs text-stone-600 dark:text-amber-200/80 font-medium">
                  <span>
                    {page.chapterLabel} · {page.subtitle}
                  </span>
                  <span className="font-code">Стр. {page.id}</span>
                </div>

                <h2
                  className="font-display font-bold text-2xl sm:text-3xl leading-tight text-[#17142e] dark:text-[#fff3c4]"
                  style={{ textWrap: 'balance' }}
                >
                  {page.title}
                </h2>

                <SceneIllustration
                  pageId={page.id}
                  nightGlow={nightGlow}
                  questCompleted={isCompleted}
                />

                <div className="space-y-3 text-[15.5px] sm:text-[16.5px] leading-[1.7] text-[#1f1b38] dark:text-[#fdf0c2]">
                  {page.paragraphs.map((p, idx) => (
                    <p
                      key={idx}
                      className={
                        idx === 0
                          ? 'first-letter:font-display first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:leading-[0.9] first-letter:text-amber-600 dark:first-letter:text-amber-300'
                          : ''
                      }
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              {/* Author credit on cover OR Whisper Hint toggle */}
              <div className="relative z-10 pt-3 border-t border-current/15 flex flex-col gap-2">
                {page.isCover ? (
                  <p className="text-xs font-medium text-stone-700 dark:text-amber-200/85">
                    Автор идеи и сказки: Калимов Ильдар · 4 «В» класс · «Smart Bilim»
                  </p>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowHint((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-800 dark:text-amber-300 hover:underline cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      {showHint ? 'Скрыть подсказку книги' : 'Подсказка Книги-Звезды'}
                    </button>
                    {showHint && (
                      <p className="mt-2 p-2.5 rounded-lg bg-amber-500/12 border border-amber-500/25 text-xs leading-relaxed text-[#262147] dark:text-[#fef3c4]">
                        {page.whisperHint}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* RIGHT FOLIO: Interactive Quest / Mini-Game */}
            <section
              aria-label="Интерактивное задание"
              className={`relative ${paperClass} p-5 sm:p-8 lg:min-h-[560px] flex flex-col justify-between gap-5 transition-colors duration-500`}
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 spine-shadow-right" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-stone-600 dark:text-amber-200/80 font-medium">
                    Интерактивная страница
                  </span>
                  {!page.isFinale && (
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        isCompleted
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-stone-700 dark:text-amber-200/80'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isCompleted ? 'Квест выполнен' : 'Ожидает действия'}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl leading-snug text-[#17142e] dark:text-[#fff3c4]">
                    {page.questTitle}
                  </h3>
                  <p className="text-sm text-[#353054] dark:text-[#f8e7af] mt-1 leading-relaxed">
                    {page.questInstruction}
                  </p>
                </div>

                <div className="pt-2">{renderQuest()}</div>
              </div>

              <div className="relative z-10 pt-3 border-t border-current/15 flex items-center justify-between text-xs font-medium text-stone-600 dark:text-amber-200/80">
                <span>Листай стрелками или свайпом</span>
                <span className="font-code">{page.id} / 18</span>
              </div>
            </section>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

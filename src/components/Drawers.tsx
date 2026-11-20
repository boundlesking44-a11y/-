import { CheckCircle2, X } from 'lucide-react';
import { ARTIFACTS, STORY_PAGES } from '../data/storyPages';
import type { ArtifactId } from '../types/book';
import { ArtifactIconSvg } from './Characters';

interface DrawerShellProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function DrawerShell({ title, onClose, children }: DrawerShellProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-[#121533] text-[#f6efe0] border-l border-amber-300/20 p-6 overflow-y-auto flex flex-col gap-5 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="font-display font-bold text-xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="p-2 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ChaptersDrawer({
  currentPage,
  completedQuests,
  onSelectPage,
  onClose,
}: {
  currentPage: number;
  completedQuests: number[];
  onSelectPage: (pageId: number) => void;
  onClose: () => void;
}) {
  return (
    <DrawerShell title="Карта квестов · 18 страниц" onClose={onClose}>
      <p className="text-xs text-slate-300 leading-relaxed">
        Выбирай любую страницу, чтобы перечитать сказку или допройти пропущенный квест.
      </p>
      <div className="flex flex-col gap-2">
        {STORY_PAGES.map((p) => {
          const active = p.id === currentPage;
          const done = completedQuests.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onSelectPage(p.id);
                onClose();
              }}
              className={`flex items-center justify-between gap-3 p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                active
                  ? 'border-amber-400 bg-amber-400/15 text-amber-100'
                  : 'border-white/10 hover:border-amber-300/50 bg-white/5'
              }`}
            >
              <div className="min-w-0">
                <div className="text-xs text-slate-400 font-code">
                  {String(p.id).padStart(2, '0')} · {p.chapterLabel}
                </div>
                <div className="text-sm font-medium truncate">{p.title}</div>
              </div>
              {done && (
                <CheckCircle2
                  className="w-4 h-4 text-emerald-400 shrink-0"
                  aria-label="Квест выполнен"
                />
              )}
            </button>
          );
        })}
      </div>
    </DrawerShell>
  );
}

export function ArtifactsDrawer({
  artifacts,
  onJumpToPage,
  onClose,
}: {
  artifacts: ArtifactId[];
  onJumpToPage: (pageId: number) => void;
  onClose: () => void;
}) {
  return (
    <DrawerShell title="Сумка артефактов" onClose={onClose}>
      <p className="text-xs text-slate-300 leading-relaxed">
        Собрано волшебных предметов: {artifacts.length} из 6.
      </p>
      <div className="flex flex-col gap-3">
        {(Object.keys(ARTIFACTS) as ArtifactId[]).map((id) => {
          const info = ARTIFACTS[id];
          const owned = artifacts.includes(id);
          return (
            <div
              key={id}
              className={`p-3.5 rounded-xl border flex gap-3 items-start ${
                owned
                  ? 'border-amber-400/40 bg-amber-400/10'
                  : 'border-white/10 bg-white/5 opacity-60'
              }`}
            >
              <div className={owned ? '' : 'grayscale opacity-40'}>
                <ArtifactIconSvg id={id} className="w-11 h-11 shrink-0" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-sm">
                    {owned ? info.name : 'Неизвестный артефакт'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      onJumpToPage(info.foundOnPage);
                      onClose();
                    }}
                    className="text-xs text-amber-300 underline hover:text-amber-200 cursor-pointer whitespace-nowrap"
                  >
                    Стр. {info.foundOnPage}
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {owned
                    ? info.description
                    : `Пройди интерактивное задание на странице ${info.foundOnPage}, чтобы открыть этот предмет.`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </DrawerShell>
  );
}

export function AboutBookDrawer({ onClose }: { onClose: () => void }) {
  return (
    <DrawerShell title="О книге будущего" onClose={onClose}>
      <div className="space-y-4 text-sm text-slate-200 leading-relaxed">
        <p>
          «Звёздик и Книга-Звезда» — интерактивная сказка-квест, где бумага соединяется с ночным свечением, звуковыми кристаллами и загадками.
        </p>

        <div className="p-4 rounded-xl border border-amber-400/30 bg-amber-400/10 space-y-1.5 text-xs">
          <div className="font-display font-bold text-sm text-amber-200">
            Паспорт проекта
          </div>
          <div>Название: «Звёздик и Книга-Звезда»</div>
          <div>Автор: Калимов Ильдар · 4 «В» класс</div>
          <div>Школа: «Smart Bilim»</div>
        </div>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="font-semibold text-white">Как управлять книгой:</div>
          <ul className="list-disc pl-4 space-y-1">
            <li>Листай кнопками «Назад / Дальше», стрелками ← → на клавиатуре или свайпом.</li>
            <li>Включай «Ночной свет» для чтения в темноте с золотым свечением.</li>
            <li>Весь прогресс и найденные артефакты сохраняются автоматически.</li>
          </ul>
        </div>
      </div>
    </DrawerShell>
  );
}

import { ArrowLeft, Play } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { RegisteredGame } from '../platform/types';

type GamePreviewPageProps = {
  game: RegisteredGame;
  onBack: () => void;
  onPlay: () => void;
};

export function GamePreviewPage({ game, onBack, onPlay }: GamePreviewPageProps) {
  const previewStyle = {
    '--game-accent': game.catalog.accent,
  } as CSSProperties;

  return (
    <div className="platform-layout platform-layout--preview">
      <header className="platform-header">
        <button className="icon-text-button" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Back</span>
        </button>

        <div className="platform-header__title">
          <p className="platform-kicker">Preview</p>
          <h1>{game.name}</h1>
        </div>
      </header>

      <section className="game-preview" style={previewStyle}>
        <div className="game-preview__media">
          <img src={game.catalog.previewGif} alt={`${game.name} preview`} draggable="false" />
        </div>

        <button className="primary-button" type="button" onClick={onPlay}>
          <Play size={20} fill="currentColor" aria-hidden="true" />
          <span>Play</span>
        </button>
      </section>
    </div>
  );
}

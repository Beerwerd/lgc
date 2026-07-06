import { ArrowLeft } from 'lucide-react';
import { GameFrame } from '../components/GameFrame';
import type { RegisteredGame } from '../platform/types';

type GamePlayingPageProps = {
  game: RegisteredGame;
  onBack: () => void;
};

export function GamePlayingPage({ game, onBack }: GamePlayingPageProps) {
  return (
    <div className="platform-layout platform-layout--playing">
      <header className="platform-header">
        <button className="icon-text-button" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden="true" />
          <span>Back</span>
        </button>

        <div className="platform-header__title">
          <p className="platform-kicker">Playing</p>
          <h1>{game.name}</h1>
        </div>
      </header>

      <GameFrame game={game} />
    </div>
  );
}

import { AppIconTile } from "../components/AppIconTile";
import { GameCatalog, GameGrid } from "../components/GameCatalog";
import {
  GamePreviewMedia,
  GamePreviewTitle,
} from "../components/GamePreviewTiles";
import type { GameId, RegisteredGame } from "../platform/types";

type GamePreviewPageProps = {
  game: RegisteredGame;
  games: RegisteredGame[];
  isMobile: boolean;
  selectedGameId: GameId;
  onBack: () => void;
  onPlay: () => void;
  onSelectGame: (gameId: GameId) => void;
};

export function GamePreviewPage({
  game,
  games,
  isMobile,
  selectedGameId,
  onBack,
  onPlay,
  onSelectGame,
}: GamePreviewPageProps) {
  return (
    <div className="platform-layout platform-layout--preview">
      <section className="game-preview-grid" aria-label={`${game.name} preview`}>
        <GameGrid>
          <AppIconTile onClick={onBack} />
          <GamePreviewTitle game={game} />
          <GamePreviewMedia game={game} onPlay={onPlay} />
        </GameGrid>
      </section>

      <GameCatalog
        games={games}
        isMobile={isMobile}
        selectedGameId={selectedGameId}
        onSelectGame={onSelectGame}
      />
    </div>
  );
}

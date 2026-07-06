import { GameCatalog } from "../components/GameCatalog";
import type { GameId, RegisteredGame } from "../platform/types";

type MainPageProps = {
  games: RegisteredGame[];
  selectedGameId: GameId;
  onSelectGame: (gameId: GameId) => void;
};

export function MainPage({
  games,
  selectedGameId,
  onSelectGame,
}: MainPageProps) {
  return (
    <div className="platform-layout">
      <header className="platform-header">
        <div>
          <h1>Logic Arcade</h1>
        </div>
      </header>

      <GameCatalog
        games={games}
        selectedGameId={selectedGameId}
        onSelectGame={onSelectGame}
      />
    </div>
  );
}

import { AppIconTile } from "../components/AppIconTile";
import { GameCatalog } from "../components/GameCatalog";
import type { GameId, RegisteredGame } from "../platform/types";

type MainPageProps = {
  games: RegisteredGame[];
  isMobile: boolean;
  selectedGameId: GameId;
  onSelectGame: (gameId: GameId) => void;
};

export function MainPage({
  games,
  isMobile,
  selectedGameId,
  onSelectGame,
}: MainPageProps) {
  return (
    <div className="platform-layout platform-layout--main">
      <GameCatalog
        games={games}
        isMobile={isMobile}
        selectedGameId={selectedGameId}
        onSelectGame={onSelectGame}
        leadingElement={<AppIconTile />}
      />
    </div>
  );
}

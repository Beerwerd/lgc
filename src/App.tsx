import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { GamePlayingPage } from './pages/GamePlayingPage';
import { GamePreviewPage } from './pages/GamePreviewPage';
import { MainPage } from './pages/MainPage';
import { registeredGames } from './platform/gameRegistry';
import { useAppRoute } from './platform/useAppRoute';
import { usePlatformRecognition } from './platform/usePlatformRecognition';
import './platform/platform.css';

const registeredGameIds = registeredGames.map((game) => game.gameId);

export default function App() {
  const { route, navigate } = useAppRoute(registeredGameIds);
  const platform = usePlatformRecognition();
  const selectedGameId = route.gameId ?? registeredGames[0].gameId;

  const selectedGame = useMemo(
    () => registeredGames.find((game) => game.gameId === selectedGameId) ?? registeredGames[0],
    [selectedGameId],
  );

  const page = useMemo<ReactNode>(() => {
    if (route.pageName === 'game-preview') {
      return (
        <GamePreviewPage
          game={selectedGame}
          games={registeredGames}
          isMobile={platform.isMobile}
          selectedGameId={selectedGame.gameId}
          onBack={() => navigate({ pageName: 'main', gameId: null })}
          onPlay={() => navigate({ pageName: 'game-playing', gameId: selectedGame.gameId })}
          onSelectGame={(gameId) => navigate({ pageName: 'game-preview', gameId })}
        />
      );
    }

    if (route.pageName === 'game-playing') {
      return (
        <GamePlayingPage
          game={selectedGame}
          onBack={() => navigate({ pageName: 'game-preview', gameId: selectedGame.gameId })}
        />
      );
    }

    return (
      <MainPage
        games={registeredGames}
        isMobile={platform.isMobile}
        selectedGameId={selectedGame.gameId}
        onSelectGame={(gameId) => navigate({ pageName: 'game-preview', gameId })}
      />
    );
  }, [navigate, platform.isMobile, route.pageName, selectedGame]);

  return (
    <main className="app-shell" data-platform={platform.kind}>
      {page}
    </main>
  );
}

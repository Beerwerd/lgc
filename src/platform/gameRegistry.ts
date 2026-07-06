import futoshikiGame from '../games/futoshiki';
import zebraGame from '../games/zebra';
import type { GameId, GameModule, RegisteredGame } from './types';

type PlatformGameEntry = {
  gameId: GameId;
  module: GameModule;
};

const platformGames: PlatformGameEntry[] = [
  {
    gameId: 'futoshiki',
    module: futoshikiGame,
  },
  {
    gameId: 'zebra',
    module: zebraGame,
  },
];

export const registeredGames: RegisteredGame[] = platformGames.map(({ gameId, module }) => ({
  ...module,
  gameId,
}));

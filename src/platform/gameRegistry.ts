import futoshikiGame from "../games/futoshiki";
import zebraGame from "../games/zebra";
import type { GameId, GameModule, RegisteredGame } from "./types";

type PlatformGameEntry = {
  gameId: GameId;
  module: GameModule;
  catalogSize?: number;
};

const temporaryCatalogSizes = [
  1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2,
  1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1,
];

const temporaryCatalogModules = [futoshikiGame, zebraGame];

const platformGames: PlatformGameEntry[] = temporaryCatalogSizes.map(
  (catalogSize, index) => {
    const module =
      temporaryCatalogModules[index % temporaryCatalogModules.length];
    const baseGameId = module === futoshikiGame ? "futoshiki" : "zebra";

    return {
      gameId: `${baseGameId}-${index + 1}`,
      module,
      catalogSize,
    };
  }
);

export const registeredGames: RegisteredGame[] = platformGames.map(
  ({ gameId, module, catalogSize }) => ({
    ...module,
    catalog: {
      ...module.catalog,
      size: catalogSize ?? module.catalog.size,
    },
    gameId,
  })
);

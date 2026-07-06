import { useState } from "react";
import type { CSSProperties } from "react";
import type { GameId, RegisteredGame } from "../platform/types";

type GameCatalogProps = {
  games: RegisteredGame[];
  selectedGameId: GameId;
  onSelectGame: (gameId: GameId) => void;
};

type CatalogCardProps = {
  game: RegisteredGame;
  isSelected: boolean;
  onSelectGame: (gameId: GameId) => void;
};

const getAccentStyle = (game: RegisteredGame) =>
  ({
    "--game-accent": game.catalog.accent,
    "--game-size": Math.max(1, Math.min(14, Math.floor(game.catalog.size ?? 1))),
  } as CSSProperties);

function CatalogCard({ game, isSelected, onSelectGame }: CatalogCardProps) {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const previewImage = isPreviewing
    ? game.catalog.previewGif
    : game.catalog.coverImage;

  return (
    <button
      className={`catalog-card${isSelected ? " is-selected" : ""}`}
      type="button"
      style={getAccentStyle(game)}
      aria-pressed={isSelected}
      onClick={() => onSelectGame(game.gameId)}
      onFocus={() => setIsPreviewing(true)}
      onBlur={() => setIsPreviewing(false)}
      onPointerEnter={() => setIsPreviewing(true)}
      onPointerLeave={() => setIsPreviewing(false)}
    >
      <span className="catalog-card__media">
        <img
          src={previewImage}
          alt={`${game.name} preview`}
          draggable="false"
        />
        <span className="catalog-card__name" aria-hidden={!isPreviewing}>
          {game.name}
        </span>
      </span>
    </button>
  );
}

export function GameCatalog({
  games,
  selectedGameId,
  onSelectGame,
}: GameCatalogProps) {
  return (
    <section className="catalog" aria-labelledby="catalog-title">
      <div className="catalog-track">
        {games.map((game) => (
          <CatalogCard
            key={game.gameId}
            game={game}
            isSelected={game.gameId === selectedGameId}
            onSelectGame={onSelectGame}
          />
        ))}
      </div>
    </section>
  );
}

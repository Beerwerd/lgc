import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { GameId, RegisteredGame } from "../platform/types";

type GameCatalogProps = {
  games: RegisteredGame[];
  isMobile: boolean;
  selectedGameId: GameId;
  onSelectGame: (gameId: GameId) => void;
  leadingElement?: ReactNode;
};

type GameGridProps = {
  children: ReactNode;
  className?: string;
};

type CatalogCardProps = {
  game: RegisteredGame;
  isMobile: boolean;
  isSelected: boolean;
  onSelectGame: (gameId: GameId) => void;
};

const getAccentStyle = (game: RegisteredGame) =>
  ({
    "--game-accent": game.catalog.accent,
    "--game-size": Math.max(
      1,
      Math.min(14, Math.floor(game.catalog.size ?? 1))
    ),
  } as CSSProperties);

export function GameGrid({ children, className }: GameGridProps) {
  const gridClassName = ["catalog-track", className].filter(Boolean).join(" ");

  return <div className={gridClassName}>{children}</div>;
}

function CatalogCard({
  game,
  isMobile,
  isSelected,
  onSelectGame,
}: CatalogCardProps) {
  const [isPreviewing, setIsPreviewing] = useState(false);
  const shouldPreview = !isMobile && isPreviewing;
  const previewImage = shouldPreview
    ? game.catalog.previewGif
    : game.catalog.coverImage;

  const startPreview = () => {
    if (!isMobile) {
      setIsPreviewing(true);
    }
  };

  const stopPreview = () => {
    setIsPreviewing(false);
  };

  return (
    <button
      className={`catalog-card${isSelected ? " is-selected" : ""}`}
      type="button"
      style={getAccentStyle(game)}
      aria-pressed={isSelected}
      onClick={() => onSelectGame(game.gameId)}
      onFocus={startPreview}
      onBlur={stopPreview}
      onPointerEnter={startPreview}
      onPointerLeave={stopPreview}
    >
      <span className="catalog-card__media">
        <img
          src={previewImage}
          alt={`${game.name} preview`}
          draggable="false"
        />
        <span className="catalog-card__name" aria-hidden={!shouldPreview}>
          {game.name}
        </span>
      </span>
    </button>
  );
}

export function GameCatalog({
  games,
  isMobile,
  selectedGameId,
  onSelectGame,
  leadingElement,
}: GameCatalogProps) {
  return (
    <section className="catalog" aria-label="Game catalog">
      <GameGrid>
        {leadingElement}
        {games.map((game) => (
          <CatalogCard
            key={game.gameId}
            game={game}
            isMobile={isMobile}
            isSelected={game.gameId === selectedGameId}
            onSelectGame={onSelectGame}
          />
        ))}
      </GameGrid>
    </section>
  );
}

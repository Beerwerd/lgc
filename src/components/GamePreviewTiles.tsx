import { Play } from "lucide-react";
import type { CSSProperties } from "react";
import type { RegisteredGame } from "../platform/types";

type GamePreviewTitleProps = {
  game: RegisteredGame;
};

type GamePreviewMediaProps = {
  game: RegisteredGame;
  onPlay: () => void;
};

export function GamePreviewTitle({ game }: GamePreviewTitleProps) {
  return (
    <div className="preview-title-tile">
      <h1>{game.name}</h1>
    </div>
  );
}

export function GamePreviewMedia({ game, onPlay }: GamePreviewMediaProps) {
  const previewStyle = {
    "--game-accent": game.catalog.accent,
  } as CSSProperties;

  return (
    <button
      className="preview-media-tile"
      type="button"
      style={previewStyle}
      onClick={onPlay}
      aria-label={`Play ${game.name}`}
    >
      <img
        src={game.catalog.previewGif}
        alt={`${game.name} preview`}
        draggable="false"
      />
      <span className="preview-media-tile__play" aria-hidden="true">
        <Play size={34} fill="currentColor" />
      </span>
    </button>
  );
}

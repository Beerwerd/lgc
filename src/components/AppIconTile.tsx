type AppIconTileProps = {
  onClick?: () => void;
};

export function AppIconTile({ onClick }: AppIconTileProps) {
  const content = <img src="/favicon.png" alt="" draggable="false" />;

  return (
    <span className="app-icon-tile-slot">
      {onClick ? (
        <button
          className="app-icon-tile"
          type="button"
          onClick={onClick}
          aria-label="Open game catalog"
        >
          {content}
        </button>
      ) : (
        <span className="app-icon-tile" role="img" aria-label="Game catalog">
          {content}
        </span>
      )}
    </span>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Maximize2, Minimize2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { createResourceApi } from '../platform/resources';
import type { PlatformGameEvent, RegisteredGame } from '../platform/types';

type GameFrameProps = {
  game: RegisteredGame;
};

type Reaction = 'like' | 'dislike' | null;

export function GameFrame({ game }: GameFrameProps) {
  const frameRef = useRef<HTMLElement>(null);
  const [reaction, setReaction] = useState<Reaction>(null);
  const [isBrowserFullscreen, setIsBrowserFullscreen] = useState(false);
  const [isFallbackFullscreen, setIsFallbackFullscreen] = useState(false);

  const onGameEvent = useCallback((platformEvent: PlatformGameEvent) => {
    window.dispatchEvent(new CustomEvent('platform-game-event', { detail: platformEvent }));
  }, []);

  const resources = useMemo(
    () => createResourceApi(game.gameId, onGameEvent),
    [game.gameId, onGameEvent],
  );

  const isFullscreen = isBrowserFullscreen || isFallbackFullscreen;
  const RuntimeGame = game.Game;

  useEffect(() => {
    setReaction(null);
    setIsFallbackFullscreen(false);
  }, [game.gameId]);

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsBrowserFullscreen(document.fullscreenElement === frameRef.current);
    };

    document.addEventListener('fullscreenchange', updateFullscreenState);

    return () => {
      document.removeEventListener('fullscreenchange', updateFullscreenState);
    };
  }, []);

  const selectReaction = (nextReaction: Exclude<Reaction, null>) => {
    const resolvedReaction = reaction === nextReaction ? null : nextReaction;

    setReaction(resolvedReaction);
    resources.emit({
      type: 'platform.reaction',
      payload: {
        reaction: resolvedReaction,
      },
    });
  };

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if (document.fullscreenEnabled && frameRef.current?.requestFullscreen) {
      await frameRef.current.requestFullscreen();
      return;
    }

    setIsFallbackFullscreen((currentValue) => !currentValue);
  };

  return (
    <section
      className={`game-frame${isFullscreen ? ' is-fullscreen' : ''}`}
      ref={frameRef}
      aria-label={`${game.name} game area`}
    >
      <header className="game-frame__header">
        <div>
          <p className="platform-kicker">Now playing</p>
          <h2>{game.name}</h2>
        </div>

        <div className="game-frame__actions" aria-label="Game actions">
          <button
            className={reaction === 'like' ? 'is-active' : ''}
            type="button"
            aria-pressed={reaction === 'like'}
            onClick={() => selectReaction('like')}
          >
            <ThumbsUp size={18} aria-hidden="true" />
            <span>Like</span>
          </button>

          <button
            className={reaction === 'dislike' ? 'is-active' : ''}
            type="button"
            aria-pressed={reaction === 'dislike'}
            onClick={() => selectReaction('dislike')}
          >
            <ThumbsDown size={18} aria-hidden="true" />
            <span>Dislike</span>
          </button>

          <button type="button" aria-pressed={isFullscreen} onClick={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize2 size={18} aria-hidden="true" />
            ) : (
              <Maximize2 size={18} aria-hidden="true" />
            )}
            <span>Fullscreen</span>
          </button>
        </div>
      </header>

      <div className="game-frame__host">
        <RuntimeGame key={game.gameId} resources={resources} />
      </div>
    </section>
  );
}

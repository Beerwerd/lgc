import type { GameId, GameResourceEvent, PlatformGameEvent, ResourceApi } from './types';

type GameEventListener = (event: PlatformGameEvent) => void;

const storagePrefix = 'logic-arcade';

const getStorageKey = (gameId: GameId, key: string) => `${storagePrefix}:${gameId}:${key}`;

export const createResourceApi = (
  gameId: GameId,
  onEvent: GameEventListener = () => undefined,
): ResourceApi => ({
  gameId,
  emit: (event: GameResourceEvent) => {
    onEvent({
      gameId,
      event,
      createdAt: Date.now(),
    });
  },
  getPreference: (key, fallback) => {
    const storedValue = window.localStorage.getItem(getStorageKey(gameId, key));

    if (!storedValue) {
      return fallback;
    }

    try {
      return JSON.parse(storedValue) as typeof fallback;
    } catch {
      return fallback;
    }
  },
  setPreference: (key, value) => {
    window.localStorage.setItem(getStorageKey(gameId, key), JSON.stringify(value));
  },
});

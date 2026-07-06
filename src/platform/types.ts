import type { ComponentType } from 'react';

export type GameId = string;

export type GameResourceEvent = {
  type: string;
  payload?: Record<string, unknown>;
};

export type PlatformGameEvent = {
  gameId: GameId;
  event: GameResourceEvent;
  createdAt: number;
};

export type ResourceApi = {
  readonly gameId: GameId;
  emit: (event: GameResourceEvent) => void;
  getPreference: <Value>(key: string, fallback: Value) => Value;
  setPreference: <Value>(key: string, value: Value) => void;
};

export type GameRuntimeProps = {
  resources: ResourceApi;
};

export type GameCatalogMetadata = {
  coverImage: string;
  previewGif: string;
  accent: string;
  size?: number;
};

export type GameModule = {
  name: string;
  catalog: GameCatalogMetadata;
  Game: ComponentType<GameRuntimeProps>;
};

export type RegisteredGame = GameModule & {
  gameId: GameId;
};

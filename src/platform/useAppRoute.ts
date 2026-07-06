import { useCallback, useEffect, useMemo, useState } from 'react';
import type { GameId } from './types';

export type PageName = 'main' | 'game-preview' | 'game-playing';

export type AppRoute =
  | {
      pageName: 'main';
      gameId: null;
    }
  | {
      pageName: 'game-preview' | 'game-playing';
      gameId: GameId;
    };

const mainRoute: AppRoute = {
  pageName: 'main',
  gameId: null,
};

const toRoutePath = (route: AppRoute) => {
  if (route.pageName === 'main') {
    return '/';
  }

  const gamePath = `/${encodeURIComponent(route.gameId)}`;

  if (route.pageName === 'game-preview') {
    return `${gamePath}/preview`;
  }

  return gamePath;
};

const decodePathSegment = (segment: string) => {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

const parseRoute = (pathname: string, validGameIds: Set<GameId>): AppRoute => {
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map(decodePathSegment);

  if (segments.length === 0) {
    return mainRoute;
  }

  const [gameId, pageSegment] = segments;

  if (!validGameIds.has(gameId)) {
    return mainRoute;
  }

  if (segments.length === 1) {
    return {
      pageName: 'game-playing',
      gameId,
    };
  }

  if (segments.length === 2 && pageSegment === 'preview') {
    return {
      pageName: 'game-preview',
      gameId,
    };
  }

  return mainRoute;
};

export function useAppRoute(validGameIds: GameId[]) {
  const validGameIdSet = useMemo(() => new Set(validGameIds), [validGameIds]);

  const getCurrentRoute = useCallback(
    () => parseRoute(window.location.pathname, validGameIdSet),
    [validGameIdSet],
  );

  const [route, setRoute] = useState(getCurrentRoute);

  const navigate = useCallback((nextRoute: AppRoute) => {
    const nextPath = toRoutePath(nextRoute);

    window.history.pushState(null, '', nextPath);
    setRoute(nextRoute);
  }, []);

  const replace = useCallback((nextRoute: AppRoute) => {
    const nextPath = toRoutePath(nextRoute);

    window.history.replaceState(null, '', nextPath);
    setRoute(nextRoute);
  }, []);

  useEffect(() => {
    const currentRoute = getCurrentRoute();

    setRoute(currentRoute);

    if (window.location.pathname !== toRoutePath(currentRoute)) {
      window.history.replaceState(null, '', toRoutePath(currentRoute));
    }
  }, [getCurrentRoute]);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getCurrentRoute());
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [getCurrentRoute]);

  return {
    route,
    navigate,
    replace,
  };
}

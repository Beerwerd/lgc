import { useState } from 'react';
import type { GameModule, GameRuntimeProps } from '../../platform/types';
import './zebra.css';

type ZebraAttribute = 'color' | 'drink' | 'pet';

type House = Record<ZebraAttribute, string>;

const categories: Array<{
  key: ZebraAttribute;
  label: string;
  values: string[];
}> = [
  {
    key: 'color',
    label: 'Color',
    values: ['Red', 'Blue', 'Green', 'Ivory', 'Yellow'],
  },
  {
    key: 'drink',
    label: 'Drink',
    values: ['Tea', 'Water', 'Milk', 'Coffee', 'Juice'],
  },
  {
    key: 'pet',
    label: 'Pet',
    values: ['Fox', 'Horse', 'Snail', 'Dog', 'Zebra'],
  },
];

const createInitialHouses = (): House[] => [
  { color: 'Red', drink: 'Tea', pet: 'Fox' },
  { color: 'Blue', drink: 'Water', pet: 'Horse' },
  { color: 'Green', drink: 'Milk', pet: 'Snail' },
  { color: 'Ivory', drink: 'Coffee', pet: 'Dog' },
  { color: 'Yellow', drink: 'Juice', pet: 'Zebra' },
];

function ZebraGame({ resources }: GameRuntimeProps) {
  const [houses, setHouses] = useState(() =>
    resources.getPreference('houses', createInitialHouses()),
  );

  const cycleAttribute = (houseIndex: number, category: (typeof categories)[number]) => {
    setHouses((currentHouses) => {
      const nextHouses = currentHouses.map((house) => ({ ...house }));
      const currentValue = nextHouses[houseIndex][category.key];
      const valueIndex = category.values.indexOf(currentValue);
      const nextValue = category.values[(valueIndex + 1) % category.values.length];

      nextHouses[houseIndex][category.key] = nextValue;
      resources.setPreference('houses', nextHouses);
      resources.emit({
        type: 'zebra.attribute.change',
        payload: {
          house: houseIndex + 1,
          attribute: category.key,
          value: nextValue,
        },
      });

      return nextHouses;
    });
  };

  return (
    <div className="zebra-game">
      <div className="zebra-street" aria-label="Zebra puzzle houses">
        {houses.map((house, houseIndex) => (
          <section className="zebra-house" key={houseIndex} aria-label={`House ${houseIndex + 1}`}>
            <span className="zebra-house__roof" />
            <strong>{houseIndex + 1}</strong>

            {categories.map((category) => (
              <button
                className={`zebra-chip zebra-chip--${category.key}`}
                type="button"
                key={category.key}
                onClick={() => cycleAttribute(houseIndex, category)}
              >
                <span>{category.label}</span>
                <b>{house[category.key]}</b>
              </button>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}

const zebraGame: GameModule = {
  name: 'Zebra',
  catalog: {
    coverImage: '/games/zebra-cover.png',
    previewGif: '/games/zebra-preview.gif',
    accent: '#e0b84f',
    size: 3,
  },
  Game: ZebraGame,
};

export default zebraGame;

type Difficulty = 'easy' | 'hard';

type DifficultySelectorProps = {
  activeDifficulty?: Difficulty;
};

const difficulties: Array<{ label: string; value: Difficulty }> = [
  { label: 'Easy', value: 'easy' },
  { label: 'Hard', value: 'hard' },
];

export function DifficultySelector({ activeDifficulty = 'easy' }: DifficultySelectorProps) {
  return (
    <div className="futoshiki-level-selector">
      {difficulties.map((difficulty) => {
        const isActive = difficulty.value === activeDifficulty;

        return (
          <button
            className={isActive ? 'is-active' : ''}
            key={difficulty.value}
            type="button"
          >
            {difficulty.label}
          </button>
        );
      })}
    </div>
  );
}

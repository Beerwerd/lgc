type TailVariant = 'board' | 'number';

type TailProps = {
  variant: TailVariant;
  value: number | null;
  disabled?: boolean;
  isGiven?: boolean;
  isSelected?: boolean;
  isInvalid?: boolean;
  onClick?: () => void;
};

function getTailClassName({ variant, isGiven, isSelected, isInvalid }: TailProps) {
  if (variant === 'number') {
    return 'futoshiki-tail futoshiki-number-line__tail';
  }

  return `futoshiki-tail futoshiki-board-mock__cell${isGiven ? ' is-given' : ''}${
    isSelected ? ' is-selected' : ''
  }${isInvalid ? ' is-invalid' : ''}`;
}

export function Tail(props: TailProps) {
  const { value, disabled, isGiven, onClick } = props;

  return (
    <button
      className={getTailClassName(props)}
      type="button"
      disabled={disabled ?? isGiven}
      onClick={onClick}
      onPointerDown={(event) => event.stopPropagation()}
    >
      {value}
    </button>
  );
}

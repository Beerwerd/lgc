import tailImage from '../assets/tail.png';
import tailEditableImage from '../assets/tail_editable.png';
import tailErrorImage from '../assets/tail_error.png';
import tailSelectedImage from '../assets/tail_selected.png';

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
  const { value, variant, disabled, isGiven, isSelected, isInvalid, onClick } = props;
  const valueLabel = value === null ? 'empty' : String(value);
  const isBoardTile = variant === 'board';
  const image =
    isBoardTile && isSelected
      ? tailSelectedImage
      : isBoardTile && !isGiven
        ? tailEditableImage
        : tailImage;

  return (
    <button
      className={getTailClassName(props)}
      type="button"
      disabled={disabled ?? isGiven}
      aria-label={`${valueLabel} tile`}
      onClick={onClick}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <img className="futoshiki-tail__image" src={image} alt="" aria-hidden="true" />
      {isInvalid && (
        <img
          className="futoshiki-tail__image futoshiki-tail__image--error"
          src={tailErrorImage}
          alt=""
          aria-hidden="true"
        />
      )}
      {value !== null && <span className="futoshiki-tail__value">{value}</span>}
    </button>
  );
}

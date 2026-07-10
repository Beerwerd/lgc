import tailImage from '../assets/tail.png';
import tailEditableImage from '../assets/tail_editable.png';
import tailErrorImage from '../assets/tail_error.png';
import tailSelectedImage from '../assets/tail_selected.png';

type TailVariant = 'board' | 'number';

type TailProps = {
  variant: TailVariant;
  value: number | null;
  notes?: number[];
  disabled?: boolean;
  isGiven?: boolean;
  isSelected?: boolean;
  isInvalid?: boolean;
  onClick?: () => void;
};

const NOTE_NUMBERS = [1, 2, 3, 4, 5];

function getTailClassName({ variant, isGiven, isSelected, isInvalid }: TailProps) {
  if (variant === 'number') {
    return 'futoshiki-tail futoshiki-number-line__tail';
  }

  return `futoshiki-tail futoshiki-board-mock__cell${isGiven ? ' is-given' : ''}${
    isSelected ? ' is-selected' : ''
  }${isInvalid ? ' is-invalid' : ''}`;
}

export function Tail(props: TailProps) {
  const { value, variant, notes = [], disabled, isGiven, isSelected, isInvalid, onClick } = props;
  const visibleNotes = value === null ? notes : [];
  const valueLabel =
    value === null
      ? visibleNotes.length > 0
        ? `notes ${visibleNotes.join(', ')}`
        : 'empty'
      : String(value);
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
      {visibleNotes.length > 0 && (
        <span className="futoshiki-tail__notes" aria-hidden="true">
          {NOTE_NUMBERS.map((noteNumber) => (
            <span className="futoshiki-tail__note" key={noteNumber}>
              {visibleNotes.includes(noteNumber) ? noteNumber : ''}
            </span>
          ))}
        </span>
      )}
      {value !== null && <span className="futoshiki-tail__value">{value}</span>}
    </button>
  );
}

import { FaAngleDown, FaAngleLeft, FaAngleRight, FaAngleUp } from 'react-icons/fa6';
import type { ArrowDirection } from '../logic';

type ArrowProps = {
  direction?: ArrowDirection;
  orientation: 'horizontal' | 'vertical';
  isInvalid?: boolean;
};

const arrowIcons = {
  down: FaAngleDown,
  left: FaAngleLeft,
  right: FaAngleRight,
  up: FaAngleUp,
};

export function Arrow({ direction, orientation, isInvalid }: ArrowProps) {
  const Icon = direction ? arrowIcons[direction] : null;

  return (
    <div
      className={`futoshiki-board-mock__arrow is-${orientation}${direction ? '' : ' is-empty'}${
        isInvalid ? ' is-invalid' : ''
      }`}
    >
      {Icon && (
        <span className="futoshiki-board-mock__arrow-glyph">
          <Icon />
        </span>
      )}
    </div>
  );
}

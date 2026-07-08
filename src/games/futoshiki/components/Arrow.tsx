import downArrowImage from '../assets/down_arrow.png';
import downArrowErrorImage from '../assets/down_arrow_error.png';
import leftArrowImage from '../assets/left_arrow.png';
import leftArrowErrorImage from '../assets/left_arrow_error.png';
import rightArrowImage from '../assets/right_arrow.png';
import rightArrowErrorImage from '../assets/right_arrow_error.png';
import upArrowImage from '../assets/up_arrow.png';
import upArrowErrorImage from '../assets/up_arrow_error.png';
import type { ArrowDirection } from '../logic';

type ArrowProps = {
  direction?: ArrowDirection;
  orientation: 'horizontal' | 'vertical';
  isInvalid?: boolean;
};

const arrowImages: Record<ArrowDirection, string> = {
  down: downArrowImage,
  left: leftArrowImage,
  right: rightArrowImage,
  up: upArrowImage,
};

const arrowErrorImages: Record<ArrowDirection, string> = {
  down: downArrowErrorImage,
  left: leftArrowErrorImage,
  right: rightArrowErrorImage,
  up: upArrowErrorImage,
};

export function Arrow({ direction, orientation, isInvalid }: ArrowProps) {
  return (
    <div
      className={`futoshiki-board-mock__arrow is-${orientation}${direction ? '' : ' is-empty'}${
        isInvalid ? ' is-invalid' : ''
      }`}
    >
      {direction && (
        <img
          className={`futoshiki-board-mock__arrow-glyph is-${direction}`}
          src={isInvalid ? arrowErrorImages[direction] : arrowImages[direction]}
          alt=""
          aria-hidden="true"
        />
      )}
    </div>
  );
}

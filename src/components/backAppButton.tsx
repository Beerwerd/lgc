import { FaAngleLeft } from 'react-icons/fa';

type BackAppButtonProps = {
  onClick: () => void;
};

export function BackAppButton({ onClick }: BackAppButtonProps) {
  return (
    <button className="mobile-game-back-button" type="button" onClick={onClick}>
      <FaAngleLeft size={18} aria-hidden="true" />
      <img src="/favicon.png" alt="" draggable="false" />
      <span>Back to preview</span>
    </button>
  );
}

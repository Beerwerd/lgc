import { FaRegCircleQuestion } from 'react-icons/fa6';
import { ActionButton } from './ActionButton';

type GameNameProps = {
  onHelpClick: () => void;
};

export function GameName({ onHelpClick }: GameNameProps) {
  return (
    <div className="futoshiki-title-name">
      <h3>Futoshiki</h3>
      <ActionButton
        icon={FaRegCircleQuestion}
        className="futoshiki-help-button"
        onClick={onHelpClick}
      />
    </div>
  );
}

import nameImage from "../assets/name.png";
import questionIconImage from "../assets/question_icon.png";
import { ActionButton } from "./ActionButton";

type GameNameProps = {
  onHelpClick: () => void;
};

export function GameName({ onHelpClick }: GameNameProps) {
  return (
    <div className="futoshiki-title-name">
      <img
        className="futoshiki-title-name__image"
        src={nameImage}
        alt="Futoshiki"
      />
      <ActionButton
        icon={questionIconImage}
        variant="blue"
        rounded
        className="futoshiki-help-button"
        onClick={onHelpClick}
      />
    </div>
  );
}

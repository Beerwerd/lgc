import nameImage from "../assets/name.png";

export function GameName() {
  return (
    <div className="futoshiki-title-name">
      <img
        className="futoshiki-title-name__image"
        src={nameImage}
        alt="Futoshiki"
      />
    </div>
  );
}

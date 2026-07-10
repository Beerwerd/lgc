import cancelIconImage from "../assets/cancel_icon.png";
import cancelRedIconImage from "../assets/cancel_red_icon.png";
import doneGreenIconImage from "../assets/done_green_icon.png";
import howToPlayImage from "../assets/how_to_play.png";
import { NUMBER_OPTIONS } from "../logic";
import { Arrow } from "./Arrow";
import { Button } from "./Button";
import { Tail } from "./Tail";

const helpTailValueStyle = {
  fontSize: "clamp(1.45rem, 5.2vw, 2.5rem)",
};

type HowToPlayDialogProps = {
  isClosing: boolean;
  onClose: () => void;
  onClosed: () => void;
};

export function HowToPlayDialog({
  isClosing,
  onClose,
  onClosed,
}: HowToPlayDialogProps) {
  return (
    <div
      className={`futoshiki-help-modal${isClosing ? " is-closing" : ""}`}
      onAnimationEnd={(event) => {
        if (event.currentTarget === event.target && isClosing) {
          onClosed();
        }
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <section
        className="futoshiki-help-modal__dialog futoshiki-how-to-play"
        aria-label="How to Play"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="futoshiki-how-to-play__header">
          <Button
            className="futoshiki-how-to-play__title-button"
            variant="brown"
            size="stretch"
            style={{ height: "clamp(82px, 15vw, 110px)" }}
            tabIndex={-1}
            aria-hidden="true"
          >
            <img
              className="futoshiki-how-to-play__title-image"
              src={howToPlayImage}
              alt=""
              aria-hidden="true"
            />
          </Button>
        </div>
        <Button
          className="futoshiki-how-to-play__close"
          icon={cancelIconImage}
          variant="red"
          style={{
            width: "clamp(48px, 11vw, 66px)",
            height: "clamp(48px, 11vw, 66px)",
            minWidth: "clamp(48px, 11vw, 66px)",
          }}
          aria-label="Close"
          onClick={onClose}
        />

        <div className="futoshiki-how-to-play__content">
          <section className="futoshiki-how-to-play__rule futoshiki-how-to-play__rule--numbers">
            <div className="futoshiki-how-to-play__numbers-demo">
              <div className="futoshiki-how-to-play__row-set">
                <div className="futoshiki-how-to-play__tail-row">
                  {NUMBER_OPTIONS.map((number) => (
                    <Tail
                      key={number}
                      variant="board"
                      value={number}
                      valueStyle={helpTailValueStyle}
                      disabled
                    />
                  ))}
                </div>
                <div className="futoshiki-how-to-play__row-explain">
                  <div className="futoshiki-how-to-play__row-guide">
                    <div className="futoshiki-how-to-play__guide-line">
                      {NUMBER_OPTIONS.map((number) => (
                        <span key={number} />
                      ))}
                    </div>
                    <img
                      className="futoshiki-how-to-play__status-icon"
                      src={doneGreenIconImage}
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                  <div className="futoshiki-how-to-play__row-copy">
                    <p>Rows and columns use 1-5 once.</p>
                  </div>
                </div>
              </div>

              <div className="futoshiki-how-to-play__column-set">
                <div className="futoshiki-how-to-play__guide-line futoshiki-how-to-play__guide-line--vertical">
                  {NUMBER_OPTIONS.map((number) => (
                    <span key={number} />
                  ))}
                </div>
                <div className="futoshiki-how-to-play__tail-column">
                  {NUMBER_OPTIONS.map((number) => (
                    <Tail
                      key={number}
                      variant="board"
                      value={number}
                      valueStyle={helpTailValueStyle}
                      disabled
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="futoshiki-how-to-play__rule futoshiki-how-to-play__rule--arrows">
            <div className="futoshiki-how-to-play__comparison">
              <Tail
                variant="board"
                value={2}
                valueStyle={helpTailValueStyle}
                disabled
              />
              <Arrow orientation="horizontal" direction="left" scale={0.82} />
              <Tail
                variant="board"
                value={5}
                valueStyle={helpTailValueStyle}
                disabled
              />
              <img
                className="futoshiki-how-to-play__status-icon"
                src={doneGreenIconImage}
                alt=""
                aria-hidden="true"
              />
            </div>
            <div className="futoshiki-how-to-play__rule-divider" />
            <div className="futoshiki-how-to-play__comparison">
              <Tail
                variant="board"
                value={5}
                valueStyle={helpTailValueStyle}
                disabled
              />
              <Arrow
                orientation="horizontal"
                direction="left"
                isInvalid
                scale={0.82}
              />
              <Tail
                variant="board"
                value={2}
                valueStyle={helpTailValueStyle}
                disabled
              />
              <img
                className="futoshiki-how-to-play__status-icon"
                src={cancelRedIconImage}
                alt=""
                aria-hidden="true"
              />
            </div>
            <p>The small end points to the smaller number.</p>
          </section>
        </div>
      </section>
    </div>
  );
}

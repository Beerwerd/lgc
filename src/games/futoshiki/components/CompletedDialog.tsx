import completedTextImage from "../assets/completed.png";
import congratBgImage from "../assets/congrat_bg.png";
import { Button } from "./Button";

type CompletedDialogProps = {
  onNext: () => void;
};

const completedDialogStyles = `
.futoshiki-complete-modal {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: grid;
  place-items: center;
  padding: clamp(18px, 5vw, 42px);
  background: rgba(18, 6, 8, 0.58);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  animation: futoshiki-complete-modal-fade-in 180ms ease-in-out both;
}

.futoshiki-complete-modal__dialog {
  position: relative;
  display: grid;
  width: min(86vw, calc(86vh * 729 / 613), 729px);
  aspect-ratio: 729 / 613;
  justify-items: center;
  gap: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  text-align: center;
  animation: futoshiki-complete-modal-pop-in 220ms ease-in-out both;
}

.futoshiki-complete-modal__panel {
  position: relative;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 20px 26px rgba(17, 5, 3, 0.42));
  isolation: isolate;
}

.futoshiki-complete-modal__panel::before {
  content: "";
  position: absolute;
  inset: 17.1% 7.2% 10.4%;
  z-index: 0;
  border-radius: clamp(18px, 4vw, 38px);
  background:
    radial-gradient(circle at 8% 13%, rgba(255, 231, 172, 0.82) 0 1px, transparent 1.5px)
      0 0 / 14px 14px,
    linear-gradient(180deg, #fff0c1 0%, #ffe8ad 52%, #ffdda1 100%);
  box-shadow:
    inset 0 0 0 2px rgba(236, 186, 79, 0.54),
    inset 0 0 18px rgba(114, 58, 16, 0.1);
}

.futoshiki-complete-modal__border {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
  -webkit-user-select: none;
  user-select: none;
}

.futoshiki-complete-modal__content {
  position: absolute;
  inset: 24% 12% 16%;
  z-index: 2;
  display: grid;
  grid-template-rows: auto auto 1fr;
  justify-items: center;
  align-items: center;
  gap: clamp(9px, 2vw, 17px);
}

.futoshiki-complete-modal__title {
  display: block;
  width: min(84%, 487px);
  height: auto;
  filter: drop-shadow(0 4px 0 rgba(77, 31, 8, 0.38));
  pointer-events: none;
  -webkit-user-select: none;
  user-select: none;
}

.futoshiki-complete-modal__message {
  display: grid;
  width: min(76%, 430px);
  grid-template-columns: minmax(42px, 1fr) auto minmax(42px, 1fr);
  align-items: center;
  gap: clamp(10px, 2.4vw, 18px);
  color: #5b2b12;
  font-family: "Futoshiki Baloo 2", system-ui, sans-serif;
  font-size: clamp(1.02rem, 3.5vw, 1.7rem);
  font-weight: 850;
  line-height: 1;
  text-shadow: 0 2px 0 rgba(255, 235, 184, 0.8);
  white-space: nowrap;
}

.futoshiki-complete-modal__message span {
  position: relative;
  display: block;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(188, 96, 28, 0.9) 26%,
    rgba(188, 96, 28, 0.9)
  );
}

.futoshiki-complete-modal__message span:first-child {
  transform: scaleX(-1);
}

.futoshiki-complete-modal__message span::after {
  content: "";
  position: absolute;
  top: 50%;
  right: -8px;
  width: clamp(8px, 1.8vw, 12px);
  height: clamp(8px, 1.8vw, 12px);
  border-radius: 2px;
  background: #c26a22;
  box-shadow: 0 1px 0 rgba(255, 222, 145, 0.8);
  transform: translateY(-50%) rotate(45deg);
}

.futoshiki-complete-modal__button {
  align-self: start;
  width: clamp(170px, 34%, 246px);
  height: clamp(58px, 9vw, 72px);
  margin-top: clamp(5px, 1vw, 8px);
  filter: drop-shadow(0 8px 5px rgba(42, 45, 19, 0.34));
}

.futoshiki-complete-modal__button button {
  font-family: "Futoshiki Baloo 2", system-ui, sans-serif;
  font-size: clamp(2rem, 6.2vw, 3.25rem) !important;
  text-shadow:
    0 2px 0 rgba(54, 104, 34, 0.3),
    0 3px 4px rgba(0, 0, 0, 0.12);
}

@keyframes futoshiki-complete-modal-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes futoshiki-complete-modal-pop-in {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(10px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
`;

export function CompletedDialog({ onNext }: CompletedDialogProps) {
  return (
    <div
      className="futoshiki-complete-modal"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <style>{completedDialogStyles}</style>
      <section
        className="futoshiki-complete-modal__dialog"
        aria-label="Level completed"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="futoshiki-complete-modal__panel">
          <div className="futoshiki-complete-modal__content">
            <img
              className="futoshiki-complete-modal__title"
              src={completedTextImage}
              alt="Completed!"
              draggable={false}
            />
            <div className="futoshiki-complete-modal__message">
              <span aria-hidden="true" />
              <strong>Level cleared!</strong>
              <span aria-hidden="true" />
            </div>
            <div className="futoshiki-complete-modal__button">
              <Button variant="green" size="stretch" onClick={onNext}>
                Next
              </Button>
            </div>
          </div>
          <img
            className="futoshiki-complete-modal__border"
            src={congratBgImage}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
        </div>
      </section>
    </div>
  );
}

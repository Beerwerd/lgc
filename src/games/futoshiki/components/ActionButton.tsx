import type { IconType } from 'react-icons';

export type ActionButtonProps = {
  icon: IconType;
  className?: string;
  rounded?: boolean;
  onClick?: () => void;
};

export function ActionButton({
  icon: Icon,
  className = '',
  rounded = false,
  onClick,
}: ActionButtonProps) {
  const resolvedClassName = `${className}${rounded ? ' is-rounded' : ''}`.trim();

  return (
    <button
      className={resolvedClassName || undefined}
      type="button"
      onClick={onClick}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <Icon />
    </button>
  );
}

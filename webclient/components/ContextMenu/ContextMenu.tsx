import { getEventCoordinates } from "@dnd-kit/utilities";
import classNames from "@webclient/../core/src/react/class-names";
import React, { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactElement;
  items: {
    label: React.ReactNode;
    onClick: () => void;
  }[];
};

const ContextMenu: React.FC<Props> = ({ children, ...props }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLElement | MouseEvent>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsOpen((p) => !p);
  };

  const outsideClickHandler = (event: MouseEvent) => {
    if (event.target instanceof Node && !ref.current?.contains(event.target)) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", outsideClickHandler);
    }

    return () => {
      document.removeEventListener("click", outsideClickHandler);
    };
  }, [isOpen]);

  return (
    <>
      {React.cloneElement(children, {
        onClick: handleOpen,
        style: isOpen ? { display: "block", cursor: "pointer" } : {},
      })}

      <div
        ref={ref}
        className={classNames([
          "context-menu",
          "overflow-hidden absolute z-10 dark:bg-slate-700 bg-white dark:border-slate-600 border-slate-200 rounded-lg shadow-md",
          isOpen && "max-w-xs py-1.5 max-h-96 border",
          !isOpen && "max-w-none max-h-0",
        ])}
        style={{
          transform: `translate(-10px, 10px)`,
        }}
      >
        {props.items.map((item, index) => (
          <div
            className="context-menu-item text-[15px] leading-[15px] select-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 py-1.5 px-4"
            onClick={() => {
              item.onClick?.();
              setIsOpen(false);
            }}
            key={index}
          >
            {item.label}
          </div>
        ))}
      </div>
    </>
  );
};

export default ContextMenu;

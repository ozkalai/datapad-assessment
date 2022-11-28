import { Coordinates } from "@dnd-kit/core/dist/types";

export function isMouseEvent(event: Event): event is MouseEvent {
  return (
    (window?.MouseEvent && event instanceof MouseEvent) ||
    event.type.includes("mouse")
  );
}

export function isTouchEvent(event: Event): event is TouchEvent {
  return window?.TouchEvent && event instanceof TouchEvent;
}

export function getEventCoordinates(event: Event): Coordinates {
  if (isTouchEvent(event)) {
    if (event.touches && event.touches.length) {
      const { clientX: x, clientY: y } = event.touches[0];

      return {
        x,
        y,
      };
    } else if (event.changedTouches && event.changedTouches.length) {
      const { clientX: x, clientY: y } = event.changedTouches[0];

      return {
        x,
        y,
      };
    }
  }

  if (isMouseEvent(event)) {
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }

  return {
    x: 0,
    y: 0,
  };
}
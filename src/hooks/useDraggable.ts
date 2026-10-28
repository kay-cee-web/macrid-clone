"use client";

import { useRef, useState, type PointerEvent } from "react";

type Point = { x: number; y: number };

/** How far a press has to travel before it counts as a drag rather than a click. */
const THRESHOLD = 4;
/** Kept clear of the window's edge, so the handle can always be grabbed again. */
const MARGIN = 8;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

/**
 * Drag a fixed-position element around the window by its handle.
 *
 * `pos` stays null until the first drag, so the caller's own default placement
 * (CSS) holds on the server and before anyone moves it. Pointer events cover
 * mouse, pen and touch alike; the handle needs `touch-none` so a finger drags
 * rather than scrolls.
 *
 * A drag ends in a click on the handle like any press does, so `wasDrag()` tells
 * the click handler to ignore that one.
 */
export function useDraggable() {
  const [pos, setPos] = useState<Point | null>(null);
  const start = useRef<{ pointer: Point; origin: Point } | null>(null);
  const moved = useRef(false);

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    start.current = { pointer: { x: event.clientX, y: event.clientY }, origin: { x: rect.left, y: rect.top } };
    moved.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const from = start.current;
    if (!from) return;
    const dx = event.clientX - from.pointer.x;
    const dy = event.clientY - from.pointer.y;
    if (!moved.current && Math.hypot(dx, dy) < THRESHOLD) return;
    moved.current = true;
    const { width, height } = event.currentTarget.getBoundingClientRect();
    setPos({
      x: clamp(from.origin.x + dx, MARGIN, window.innerWidth - width - MARGIN),
      y: clamp(from.origin.y + dy, MARGIN, window.innerHeight - height - MARGIN),
    });
  };

  const onPointerUp = () => {
    start.current = null;
  };

  const wasDrag = () => {
    const dragged = moved.current;
    moved.current = false;
    return dragged;
  };

  return {
    pos,
    wasDrag,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  };
}

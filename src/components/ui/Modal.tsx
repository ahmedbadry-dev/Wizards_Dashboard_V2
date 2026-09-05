import type { ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

import { cn } from "../../lib/cn";

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  title: string;
  onClose: () => void;
  className?: string;
};

export function Modal({
  children,
  isOpen,
  title,
  onClose,
  className,
}: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    triggerRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => {
      const firstButton = panelRef.current?.querySelector<HTMLButtonElement>(
        "button:not([disabled])",
      );
      firstButton?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-canvas/70 p-0 backdrop-blur-[20px] xl:items-center xl:p-10"
      onMouseDown={onClose}
    >
      <div
        ref={panelRef}
        className={cn(
          "flex max-h-[70dvh] w-full flex-col overflow-hidden rounded-t-[24px] border border-border bg-surface shadow-modal xl:max-h-[90dvh] xl:max-w-[896px] xl:rounded-modal",
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-body/30 xl:hidden" />
        <div className="sr-only">
          <h2 id={titleId}>
            {title}
          </h2>
        </div>
        {children}
      </div>
    </div>
    , portalRoot,
  );
}

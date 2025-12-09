"use client";

import { ReactNode, useEffect } from "react";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  closeOnOutsideClick?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
  closeOnOutsideClick = true,
}: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-3"
      onClick={() => closeOnOutsideClick && onClose()}
    >
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg w-full p-6 relative transition-all",
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}

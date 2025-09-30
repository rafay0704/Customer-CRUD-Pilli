import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          w-full max-w-md p-6 rounded-2xl shadow-xl
          bg-white/90 dark:bg-black/900
          border border-gray-200 dark:border-gray-700
          dark:text-gray-100
          backdrop-blur-lg
          transition-colors duration-300
          max-h-[90vh] overflow-y-auto
        "
      >
        {/* Accessible title (hidden visually but available for screen readers) */}
        <VisuallyHidden>
          <DialogTitle>Customer Form</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden>
          <DialogDescription>Fill in customer details</DialogDescription>
        </VisuallyHidden>

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;

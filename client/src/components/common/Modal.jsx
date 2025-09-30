import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Dialog   open={isOpen} onOpenChange={onClose} className="z-[9999]  backdrop-blur-lg">
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
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;

import { useEffect } from "react";

export default function Modal({ isOpen, onClose, children }) {
  // Evita scroll en el body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 m-auto bg-black/30 backdrop-blur-sm flex justify-center items-center transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className={`relative rounded-md z-10 transform transition-transform duration-300 scale-100 md:scale-100`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre */}
        <button
          className="absolute top-10 right-10 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ✕
        </button>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

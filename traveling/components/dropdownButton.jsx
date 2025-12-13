"use client";

import { useRef, useEffect } from "react";

export default function DropdownButton({
  open = false,   // 👈 estado viene del padre
  onClose,
  options = [],
  svg,
  classDropdown = "",
  classOption = ""
}) {
  const wrapperRef = useRef(null);

  // CLICK OUTSIDE universal, probado y funcional
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        onClose?.();
      }
    }

    if (open) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [open, onClose]);

  return (
    <div ref={wrapperRef} className={`relative ${classDropdown}`}>
      {svg && (
        <div className="inline-flex items-center justify-center">
          {svg}
        </div>
      )}
      {open && (
        <div className="absolute bg-white shadow-lg top-12 right-0 z-50 w-32 rounded">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                opt.value === "logout" && opt.logout?.();
                onClose?.();
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${classOption}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

  

 
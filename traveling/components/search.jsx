"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosSearch } from "react-icons/io";

export default function Search({ value, tableName, role, onSearch }) {
  const [query, setQuery] = useState(value || "");
  const [isEmpty, setIsEmpty] = useState(false);

  const router = useRouter();

  // Cada vez que cambia el prop value, actualiza el input
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Debounce para búsqueda en tiempo real (admin)
  useEffect(() => {
    if (role !== "admin") return;

    const debounceTimeout = setTimeout(() => {
      if (query.trim()) {
        setIsEmpty(false);
        if (onSearch) onSearch(query.trim());
      } else {
        setIsEmpty(true);
        if (onSearch) onSearch("");
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query, role, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setIsEmpty(true);
      return;
    }

    setIsEmpty(false);

    if (role === "admin") {
      // Admin ya dispara búsqueda en tiempo real, pero aseguramos que al submit también funcione
      onSearch(query.trim());
    }

    if (role === "cliente") {
      router.push(
        `/client/${tableName}/resultSearch?nombre=${encodeURIComponent(query.trim())}`
      );
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form className="relative" onSubmit={handleSubmit}>
        <input
          id="search"
          type="text"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full h-10 px-4 rounded-full text-gray-800 bg-gray-600/10 focus:outline-none focus:ring-2 focus:bg-white ${
            isEmpty && role !== "admin" ? "ring-red-500" : "ring-sky-500"
          }`}
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
        >
          <IoIosSearch />
        </button>
        {(isEmpty && role !== "admin") && (
          <span className="text-red-500 text-sm absolute -bottom-5 left-4">
            Campo vacío, ingrese algo para buscar
          </span>
        )}
      </form>
    </div>
  );
}

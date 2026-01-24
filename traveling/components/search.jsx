"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../utils/fetch";
import { IoIosSearch } from "react-icons/io";

export default function SearchAPI({tableName, role}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if(role === "cliente"){
      if (!query.trim()) {
        setSuggestions([]);
        setHasSearched(false);
        return;
      }
      const debounceTimeout = setTimeout(async () => {
        setLoading(true);
        setError("");
        setIsEmpty(false);
  
        try {
          const { data, error: reqError } = await apiRequest(`/api/${tableName}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
  
          if (reqError) {
            setError(reqError);
            return;
          }
  
          const filtered = data.filter((item) =>
            item.nombre_producto.toLowerCase().includes(query.toLowerCase())
          );
  
          setSuggestions(filtered);
        } catch (err) {
          console.error(err);
          setError("Error inesperado al buscar.");
        } finally {
          setHasSearched(true);
          setLoading(false);
        }
      }, 300);
  
      return () => clearTimeout(debounceTimeout);
    }
  }, [query]);

  const handleSelect = (query) => {
      setQuery("");
      setSuggestions([]);
    if(role === "cliente"){
      // Redirige usando query params válidos para Next 13
      router.push(`/client/${tableName}/resultSearch?nombre=${encodeURIComponent(query)}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setIsEmpty(true);
      return;
    }
    handleSelect(query);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form className="relative" onSubmit={handleSubmit}>
        <input
          id="search"
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-md h-10 px-4 rounded-full text-gray-800 bg-gray-600/10 focus:outline-none focus:ring-2 focus:bg-white${
            isEmpty ? "ring-red-500" : "ring-sky-500"
          }`}
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition"
        >
          <IoIosSearch />
        </button>
        {isEmpty && (
          <span className="text-red-500 text-sm absolute -bottom-5 left-4">
            Campo vacío, ingrese un producto
          </span>
        )}
      </form>

      {loading && <p className="text-gray-500 mt-2">Buscando...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {hasSearched && !loading && query && (
        <ul className="absolute mt-1 w-full bg-white shadow rounded-md z-20 max-h-60 overflow-y-auto">
          {suggestions.length > 0 ? (
            suggestions.map((item) => (
              <li
                key={item.id_producto}
                onClick={() => handleSelect(item.nombre_producto)}
                className="px-4 py-2 cursor-pointer hover:bg-sky-50"
              >
                {item.nombre_producto}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No se encontraron resultados.</li>
          )}
        </ul>
      )}
    </div>
  );
}

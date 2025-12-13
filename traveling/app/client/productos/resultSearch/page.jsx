"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest } from "../../../../utils/fetch";

export default function ProductResults() {
  const searchParams = useSearchParams();
  const nombre = searchParams.get("nombre") || "";
  const tableName = "productos";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!nombre) return;

    const fetchResults = async () => {
      try {
        const { data, error: reqError } = await apiRequest(`/api/${tableName}/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (reqError) {
          console.log(reqError);
        }

        const filtered = data.filter((prod) =>
          prod.nombreproducto.toLowerCase().includes(nombre.toLowerCase())
        );

        setResults(filtered);
      } catch (error) {
        console.error("Error al obtener resultados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [nombre]);

  return (
    <div className="max-w-2xl mx-auto pt-20">
      <h1 className="text-xl font-bold mb-4">
        Resultados para: {decodeURIComponent(nombre)}
      </h1>
      {loading ? (
        <p>Cargando...</p>
      ) : results.length > 0 ? (
        <ul className="space-y-2">
          {results.map((producto) => (
            <li key={producto.idproducto} className="p-2 bg-white shadow rounded">
              <p className="font-semibold">{producto.nombreproducto}</p>
              <p className="text-sm text-gray-500">{producto.descproducto}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../utils/fetch";
import Pagination from "../components/pagination";
import Search from "../components/search";

const ITEMS_PER_PAGE = 20;

export default function CrudInterfaze({ config }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Estados iniciales desde URL ---
  const page = Number(searchParams.get("page")) || 1;
  const initialSearch = searchParams.get("search") || "";
  const tableName = config.endpoint;
  
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // --- Fetch seguro con useCallback ---
  const fetchData = useCallback(async (searchTerm = searchInput, pageNumber = page) => {
    setLoading(true);
    try {
      const response = await apiRequest(
        `/api/crud/${tableName}?page=${pageNumber}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(searchTerm)}`
      );
      console.log("datos arrojados ", response.items)
      if (!response.error) {
        setData(response.items || []);
        setTotal(response.total || 0);
      } else {
        setData([]);
        setTotal(0);
      }
    } catch (err) {
      console.error("Error al obtener datos:", err);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [tableName]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== searchInput) {
      setSearchInput(urlSearch);
    }
  }, [searchParams]);

  // --- Ejecutar fetch solo al cargar, cambiar página o search ---  
  useEffect(() => {
    fetchData(initialSearch, page);
  }, [fetchData, page, initialSearch]);

  // --- Manejar búsqueda ---
  const handleSearch = (value) => {
    const params = new URLSearchParams(window.location.search);

    if (
      params.get("search") === value &&
      params.get("page") === "1"
    ) return;

    params.set("search", value);
    params.set("page", 1);

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // --- Manejar cambio de página ---
  const handlePageChange = (newPage) => {
    if (newPage === page) return;

    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage);
    params.set("search", searchInput);

    router.push(`?${params.toString()}`, { scroll: false });
  };
  
  const totalPages = total > 0 ? Math.ceil(total / ITEMS_PER_PAGE) : 1;

  return (
    <div className="space-y-4 p-2">

      {/* SEARCH */}
      <div className="p-4 flex items-center gap-4">
        <Search
          value={searchInput}
          role="admin"
          onSearch={handleSearch}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white shadow-sm rounded border">
        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 border-b sticky top-0 z-10">
              <tr>
                {config.columns.map((col) => (
                  <th key={col.field} className="px-3 py-2">{col.header}</th>
                ))}
                <th className="px-3 py-2">Acción</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={config.columns.length + 1} className="px-4 py-2 text-center">
                    Cargando...
                  </td>
                </tr>
              )}

              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan={config.columns.length + 1} className="px-4 py-2 text-center">
                    Sin resultados
                  </td>
                </tr>
              )}

              {data.map((item) => (
                <tr key={item[config.idField]} className="hover:bg-gray-50">
                  {config.columns.map((col) => (
                    <td key={col.field} className="px-4 py-2 min-w-20 font-medium">
                      {col.render ? col.render(item) : item[col.field]}
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <Link
                      href={`${config.editPath}/${item[config.idField]}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

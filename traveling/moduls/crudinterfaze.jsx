"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "../utils/fetch";
import Pagination from "../components/pagination";
import Search from "../components/search";

const ITEMS_PER_PAGE = 20;

export default function CrudInterfaze({tableName, rol}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";

    const [dato, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    // FETCH REAL
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            console.log({
                tableName,
                page,
                search,
                ITEMS_PER_PAGE
            });
            const { data, error } = await apiRequest(
                `/api/crud/${tableName}?page=${page}&limit=${ITEMS_PER_PAGE}&search=${search}`
            );

            if (!error && data.items && data.total) {
                setData(data.items);
                setTotal(data.total);
            }else if(!error){
                setData(data);
                setTotal(data.length);
            }

            setLoading(false);
        };

        fetchData();
    }, []);


    const totalPages = total < 20 ? Math.ceil(total / ITEMS_PER_PAGE) : total;

    // 🔍 SEARCH HANDLER
    const handleSearch = (value) => {
        router.push(`?search=${value}&page=1`);
    };

    return (
        <div className="space-y-4">

            {/* SEARCH + FILTER */}
            <div className="p-4 flex items-center gap-4">
                <Search onSearch={handleSearch} tableName={tableName} role="admin"/>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white shadow-sm rounded border">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-6 py-3">Nombre</th>
                            <th className="px-6 py-3">Telefono</th>
                            <th className="px-6 py-3">Correo</th>
                            <th className="px-6 py-3">Genero</th>
                            <th className="px-6 py-3">Acción</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center">
                                    Cargando...
                                </td>
                            </tr>
                        )}

                        {!loading && dato?.items?.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center">
                                    Sin resultados
                                </td>
                            </tr>
                        )}

                        {dato?.map((item) => (
                            <tr key={item.id_usuario} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">
                                    {item.nombre_usuario}
                                </td>
                                <td className="px-6 py-4">{item.telefono_usuario}</td>
                                <td className="px-6 py-4">{item.correo_usuario}</td>
                                <td className="px-6 py-4">{item.genero_usuario}</td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/admin/categorias/${item.id_usuario}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* PAGINATION */}
                <Pagination
                    page={page}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
}

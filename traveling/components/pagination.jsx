"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ page, totalPages }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Captura el search actual o vacío
    const search = searchParams.get("search") || "";

    const goToPage = (p) => {
        if (p < 1 || p > totalPages) return;
        router.push(`?page=${p}&search=${encodeURIComponent(search)}`);
    };

    // Si solo hay 1 página, no mostrar paginación
    if (totalPages <= 1) return null;

    // Rango de páginas a mostrar: 5 botones máximo alrededor de la actual
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    const pageNumbers = [];
    for (let i = start; i <= end; i++) pageNumbers.push(i);

    return (
        <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-gray-600">
                Página <strong>{page}</strong> de <strong>{totalPages}</strong>
            </span>

            <div className="flex gap-1">
                <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Anterior
                </button>

                {pageNumbers.map((p) => (
                    <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`px-3 py-1 border rounded ${
                            p === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                        }`}
                    >
                        {p}
                    </button>
                ))}

                <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}

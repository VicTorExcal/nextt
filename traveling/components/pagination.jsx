"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ page, totalPages }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const search = searchParams.get("search") || "";

    const goToPage = (p) => {
        router.push(`?page=${p}&search=${search}`);
    };
     if (totalPages > 1) return null;
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

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(Math.max(0, page - 3), page + 2)
                    .map((p) => (
                        <button
                            key={p}
                            onClick={() => goToPage(p)}
                            className={`px-3 py-1 border rounded ${
                                p === page
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-100"
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

export async function apiRequest(dir, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = baseUrl + dir;

  const isFormData = options.body instanceof FormData;

  const fetchOptions = {
    method: options.method || "GET",
    body: options.body || null,
    headers: isFormData
      ? {} // CLAVE: No agregar headers cuando hay FormData
      : {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
  };

  try {
    console.log("FETCH URL:", url);

    const response = await fetch(url, fetchOptions);
    let data;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.message || `Error en la solicitud: ${response.status}`);
    }

   // Normalizar respuesta: devolver data plano + items + total
    if (Array.isArray(data)) {
      // Backend devuelve array directo
      return {
        data,
        items: data,
        total: data.length,
        error: null,
      };
    }

    if (data && Array.isArray(data.items)) {
      // Backend devuelve { items, total }
      return {
        data,
        items: data.items,
        total: data.total ?? data.items.length,
        error: null,
      };
    }

    // Fallback seguro
    return {
      data,
      items: [],
      total: 0,
      error: null,
    };

  } catch (error) {
    console.log("Error:", error.message);
    return {
      data: null,
      items: [],
      total: 0,
      error: error.message,
    };
  }
}

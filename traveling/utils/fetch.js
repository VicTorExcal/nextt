export async function apiRequest(dir, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = baseUrl + dir;

  const isFormData = options.body instanceof FormData;

  const fetchOptions = {
    method: options.method || "GET",
    body: options.body || null,
    headers: isFormData
      ? {} //CLAVE: No agregar headers cuando hay FormData
      : {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
  };

  try {
    const response = await fetch(url, fetchOptions);
    console.log("response: ", JSON.stringify(response))
    let data;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.message || `Error en la solicitud: ${response.status}`);
    }
    return { data, error: null };

  } catch (error) { 
    console.log("Error: ", error.message)
    return { data: null, error: error.message };
  }
}

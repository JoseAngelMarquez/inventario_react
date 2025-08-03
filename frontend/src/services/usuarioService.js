const API_URL = "http://localhost:3001/api/usuarios"; // Asegúrate de que el puerto coincida con tu backend

export const loginUsuario = async (datos) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error en el login");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

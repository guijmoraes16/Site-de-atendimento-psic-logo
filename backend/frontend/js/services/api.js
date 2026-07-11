const API = {
  BASE_URL: "https://54.167.231.76:8000",

  async request(endpoint, method = "GET", body = null, auth = false) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (auth) {
      const token = Utils.recuperar(STORAGE.TOKEN);

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(
      `${this.BASE_URL}${endpoint}`,

      {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      }
    );

    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.detail || data.message || "Erro na requisição.");
    }

    return data;
  },
};

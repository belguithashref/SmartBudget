const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint, options = {}) {
  let token = localStorage.getItem("token");

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  // Access token expired or invalid
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return response;
    }

    const refreshResponse = await fetch(`${API_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!refreshResponse.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");

      window.location.href = "/login";

      return response;
    }

    const refreshData = await refreshResponse.json();

    // Save new access token
    localStorage.setItem("token", refreshData.access_token);

    token = refreshData.access_token;

    // Retry original request with new token
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return response;
}

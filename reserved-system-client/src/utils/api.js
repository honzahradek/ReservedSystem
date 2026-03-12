/**
 * Base URL of the backend API
 */
const API_URL = "http://localhost:8080";

/**
 * Centralized fetch wrapper used across the application.
 * Handles:
 * - URL composition
 * - JSON parsing
 * - HTTP error handling
 * - Consistent error object structure
 *
 * @param {string} url - API endpoint path
 * @param {object} requestOptions - Fetch configuration
 * @returns {Promise<any|null>} Parsed response data or null (DELETE)
 */
const fetchData = async (url, requestOptions) => {
  const apiUrl = `${API_URL}${url}`;

  try {
    const response = await fetch(apiUrl, requestOptions);
    
    // Detect response type
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
   
    // Parse JSON response if available  
    const data = isJson ? await response.json() : null;

    // Unified error handling for non-2xx responses
    if (!response.ok) {
      const error = new Error(data?.error || "Network or validation error occurred.");
      error.status = response.status;
      error.data = data; // Backend error payload (if provided)
      throw error;
    }

    // DELETE requests usually return no content
    return requestOptions.method !== "DELETE" ? data : null;
  }
  catch (error) {
    // Forward error to calling layer
    throw error;
  };
};

/**
 * GET request helper
 * Automatically filters out null / undefined query params.
 *
 * @param {string} url - Endpoint path
 * @param {object} params - Query parameters
 * @param {string} token - JWT token (optional)
 */
export const apiGet = (url, params, token) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, value]) => value != null)
  );

  const query = new URLSearchParams(filteredParams).toString();
  const finalUrl = query ? `${url}?${query}` : url;

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  return fetchData(finalUrl, requestOptions);
};

/**
 * POST request helper
 * Automatically attaches Authorization header if token exists.
 *
 * Prevents sending `Bearer undefined` when user is not authenticated.
 */
export const apiPost = (url, data, token) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  };
  return fetchData(url, requestOptions);
};

/**
 * PUT request helper
 * Used for updating existing resources.
 */
export const apiPut = (url, data, token) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  };
  return fetchData(url, requestOptions);
};

/**
 * DELETE request helper
 * Used for resource removal.
 */
export const apiDelete = (url, token) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };
  return fetchData(url, requestOptions);
};
import axios from 'axios';

// Read the API base URL from Vite, with a friendly local default.
function getBaseUrl() {
  const configured = import.meta.env.VITE_API_URL;
  if (configured) {
    return configured;
  }
  return 'http://localhost:5001/api';
}

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add the saved bearer token to each request.
function attachToken(config) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
}

function handleRequestError(error) {
  return Promise.reject(error);
}

// A 401 means the session ended: clear it and go back to the login page.
function handleResponseError(error) {
  const response = error.response;

  if (response && response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    if (window.location.pathname !== '/login') {
      window.location.assign('/login');
    }
  }

  return Promise.reject(error);
}

function handleSuccess(response) {
  return response;
}

api.interceptors.request.use(attachToken, handleRequestError);
api.interceptors.response.use(handleSuccess, handleResponseError);

// Pull a short, readable message out of an axios error.
export function getErrorMessage(error, fallback) {
  const defaultMessage = fallback || 'Something went wrong. Please try again.';

  if (!error) {
    return defaultMessage;
  }

  const response = error.response;
  if (response && response.data) {
    const data = response.data;

    if (data.message) {
      return data.message;
    }

    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const firstError = data.errors[0];
      if (firstError && firstError.msg) {
        return firstError.msg;
      }
      if (firstError && firstError.message) {
        return firstError.message;
      }
      if (typeof firstError === 'string') {
        return firstError;
      }
    }

    if (typeof data === 'string') {
      return data;
    }
  }

  if (error.request && !response) {
    return 'Could not reach the server. Check your connection and try again.';
  }

  return defaultMessage;
}

// Keep the HTTP status on the error so pages can handle 404 and friends.
export function toAppError(error, fallback) {
  const message = getErrorMessage(error, fallback);
  const appError = new Error(message);

  if (error && error.response) {
    appError.status = error.response.status;
  } else {
    appError.status = 0;
  }

  return appError;
}

export default api;

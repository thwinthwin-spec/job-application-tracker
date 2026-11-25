import api from './axios.js';

// Register a new demo user.
export async function registerUser(values) {
  const response = await api.post('/auth/register', {
    name: values.name,
    email: values.email,
    password: values.password,
  });
  return response.data;
}

// Sign in with an email and password.
export async function loginUser(values) {
  const response = await api.post('/auth/login', {
    email: values.email,
    password: values.password,
  });
  return response.data;
}

// Tell the API the session is over.
export async function logoutUser() {
  const response = await api.post('/auth/logout');
  return response.data;
}

// Ask the API who the current user is.
export async function fetchMe() {
  const response = await api.get('/auth/me');
  return response.data;
}

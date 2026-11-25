import api from './axios.js';

// Fetch one page of applications using the current filters.
export async function fetchApplications(params) {
  const response = await api.get('/applications', { params: params });
  return response.data;
}

// Fetch dashboard totals and upcoming items.
export async function fetchStats() {
  const response = await api.get('/applications/stats');
  return response.data;
}

// Fetch one application by id.
export async function fetchApplication(id) {
  const response = await api.get('/applications/' + id);
  return response.data;
}

// Create a new application.
export async function createApplication(values) {
  const response = await api.post('/applications', values);
  return response.data;
}

// Save changes to an existing application.
export async function updateApplication(id, values) {
  const response = await api.put('/applications/' + id, values);
  return response.data;
}

// Remove an application.
export async function deleteApplication(id) {
  const response = await api.delete('/applications/' + id);
  return response.data;
}

// Download the filtered list as a CSV file.
export async function exportApplications(params) {
  const response = await api.get('/applications/export', {
    params: params,
    responseType: 'blob',
  });
  return response;
}

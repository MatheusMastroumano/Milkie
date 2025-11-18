const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function apiJson(endpoint, options = {}) {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ mensagem: 'Erro na requisição' }));
    throw new Error(error.mensagem || error.erro || `Erro ${response.status}`);
  }

  return await response.json();
}

async function apiFormData(endpoint, formData, options = {}) {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || 'POST',
    headers,
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ mensagem: 'Erro na requisição' }));
    throw new Error(error.mensagem || error.erro || `Erro ${response.status}`);
  }

  return await response.json();
}

export { apiJson, apiFormData };



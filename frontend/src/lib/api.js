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
    let error = null;
    let errorText = '';
    let errorMessage = '';
    
    try {
      // Tentar ler como texto primeiro
      errorText = await response.text();
      
      // Tentar parsear como JSON
      if (errorText && errorText.trim()) {
        try {
          error = JSON.parse(errorText);
          errorMessage = error?.mensagem || error?.erro || error?.error || error?.message;
        } catch (parseError) {
          // Se não for JSON, usar o texto como mensagem
          errorMessage = errorText;
          error = { mensagem: errorText, raw: errorText };
        }
      }
    } catch (readError) {
      console.error('Erro ao ler resposta:', readError);
      errorText = `Erro ao ler resposta: ${readError.message}`;
    }
    
    // Se ainda não tiver mensagem, usar mensagens padrão baseadas no status
    if (!errorMessage) {
      const statusMessages = {
        400: 'Requisição inválida. Verifique os dados enviados.',
        401: 'Não autenticado. Faça login novamente.',
        403: 'Acesso negado. Você precisa ser admin ou gerente para acessar esta funcionalidade.',
        404: 'Recurso não encontrado',
        500: 'Erro interno do servidor. Verifique se o servidor está rodando corretamente.',
        503: 'Serviço indisponível'
      };
      errorMessage = statusMessages[response.status] || `Erro ${response.status}: ${response.statusText || 'Erro desconhecido'}`;
    }
    
    // Log detalhado para debug
    const logData = {
      endpoint: `${API_URL}${endpoint}`,
      method: options.method || 'GET',
      status: response.status,
      statusText: response.statusText,
      errorMessage,
      errorText: errorText || '(resposta vazia)',
      errorObject: error,
      hasErrorObject: error !== null && typeof error === 'object' && Object.keys(error || {}).length > 0,
      requestBody: options.body ? (typeof options.body === 'string' ? options.body.substring(0, 300) : JSON.stringify(options.body).substring(0, 300)) : undefined
    };
    
    console.error('❌ Erro na API:', logData);
    
    throw new Error(errorMessage);
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
    let error = null;
    let errorText = '';
    let errorMessage = '';
    
    try {
      // Tentar ler como texto primeiro
      errorText = await response.text();
      
      // Tentar parsear como JSON
      if (errorText && errorText.trim()) {
        try {
          error = JSON.parse(errorText);
          errorMessage = error?.mensagem || error?.erro || error?.error || error?.message;
        } catch (parseError) {
          // Se não for JSON, usar o texto como mensagem
          errorMessage = errorText;
          error = { mensagem: errorText, raw: errorText };
        }
      }
    } catch (readError) {
      console.error('Erro ao ler resposta:', readError);
      errorText = `Erro ao ler resposta: ${readError.message}`;
    }
    
    // Se ainda não tiver mensagem, usar mensagens padrão baseadas no status
    if (!errorMessage) {
      const statusMessages = {
        400: 'Requisição inválida. Verifique os dados enviados.',
        401: 'Não autenticado. Faça login novamente.',
        403: 'Acesso negado. Você precisa ser admin ou gerente para acessar esta funcionalidade.',
        404: 'Recurso não encontrado',
        500: 'Erro interno do servidor. Verifique se o servidor está rodando corretamente.',
        503: 'Serviço indisponível'
      };
      errorMessage = statusMessages[response.status] || `Erro ${response.status}: ${response.statusText || 'Erro desconhecido'}`;
    }
    
    // Log detalhado para debug
    const logData = {
      endpoint: `${API_URL}${endpoint}`,
      method: options.method || 'GET',
      status: response.status,
      statusText: response.statusText,
      errorMessage,
      errorText: errorText || '(resposta vazia)',
      errorObject: error,
      hasErrorObject: error !== null && typeof error === 'object' && Object.keys(error || {}).length > 0,
      requestBody: options.body ? (typeof options.body === 'string' ? options.body.substring(0, 300) : JSON.stringify(options.body).substring(0, 300)) : undefined
    };
    
    console.error('❌ Erro na API:', logData);
    
    throw new Error(errorMessage);
  }

  return await response.json();
}

export { apiJson, apiFormData };



export function resolveApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  return envUrl || "http://localhost:8080";
}

export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const base = resolveApiBaseUrl();
  const url = path.startsWith("http") ? path : `${base}${path}`;
  const res = await fetch(url, {
    credentials: "include",
    mode: "cors",
    ...init,
  });
  return res;
}

export async function apiJson<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
  } as Record<string, string>;

  const res = await apiFetch(path, { ...init, headers });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // ignore json parse error
  }

  if (!res.ok) {
    let backendMessage: any =
      body?.mensagem ?? body?.message ?? body?.error ?? body;
    if (typeof backendMessage === "object") {
      try {
        backendMessage = JSON.stringify(backendMessage);
      } catch {
        backendMessage = String(backendMessage);
      }
    }
    throw new Error(`${backendMessage || "Erro na solicitação"} (HTTP ${res.status})`);
  }

  return body as T;
}



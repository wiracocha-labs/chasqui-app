/**
 * Cliente HTTP para el backend Chasqui (REST).
 * Base URL desde API_CONFIG. Opcionalmente envía JWT en Authorization.
 */

import { API_CONFIG } from '../config'

export type ApiMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export interface ApiFetchOptions {
  method?: ApiMethod
  body?: unknown
  token?: string | null
  signal?: AbortSignal
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function buildUrl(path: string): string {
  const base = API_CONFIG.baseUrl.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

/**
 * Petición al backend. Path sin base (ej. '/tasks'). Si body existe, se envía como JSON.
 * Si token está definido, añade header Authorization: Bearer <token>.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { method = 'GET', body, token, signal } = options
  const url = buildUrl(path)

  const headers: Record<string, string> = {}
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout)
  const effectiveSignal = signal ?? controller.signal

  try {
    const res = await fetch(url, {
      method,
      headers: Object.keys(headers).length ? headers : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: effectiveSignal
    })
    clearTimeout(timeoutId)

    const text = await res.text()
    let data: T
    try {
      data = (text ? JSON.parse(text) : null) as T
    } catch {
      // If parsing fails we keep the raw text, but detect obvious HTML error pages
      data = text as unknown as T
    }
    // If server responded with an OK status but returned HTML (e.g. an error page
    // from a tunneling service like ngrok), treat it as an error to avoid callers
    // assuming it's JSON (which causes `convs.filter is not a function`).
    if (res.ok && typeof data === 'string' && data.trim().startsWith('<')) {
      throw new ApiError('Non-JSON response from API (HTML received)', res.status, data)
    }

    if (!res.ok) {
      throw new ApiError(
        (data && typeof data === 'object' && 'message' in data ? String((data as { message: unknown }).message) : res.statusText) || `HTTP ${res.status}`,
        res.status,
        data
      )
    }
    return data
  } catch (err) {
    clearTimeout(timeoutId)
    if (err instanceof ApiError) throw err
    if (err instanceof SyntaxError) throw err
    throw new ApiError(
      err instanceof Error ? err.message : 'Network or request failed',
      0,
      undefined
    )
  }
}

export function apiGet<T = unknown>(path: string, token?: string | null): Promise<T> {
  return apiFetch<T>(path, { method: 'GET', token })
}

export function apiPost<T = unknown>(path: string, body?: unknown, token?: string | null): Promise<T> {
  return apiFetch<T>(path, { method: 'POST', body, token })
}

export function apiPatch<T = unknown>(path: string, body: unknown, token?: string | null): Promise<T> {
  return apiFetch<T>(path, { method: 'PATCH', body, token })
}

/**
 * Prueba de conexión al backend (Paso 1). En dev puedes llamarla desde consola: window.chasquiApiTest()
 */
export async function testBackendConnection(): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  try {
    const data = await apiGet<unknown>('/tasks')
    if (import.meta.env.DEV) {
      console.log('🔌 Backend OK:', API_CONFIG.baseUrl, '→', data)
    }
    return { ok: true, data }
  } catch (e) {
    const error = e instanceof ApiError ? `${e.status}: ${e.message}` : String(e)
    if (import.meta.env.DEV) {
      console.warn('🔌 Backend unreachable:', error)
    }
    return { ok: false, error }
  }
}

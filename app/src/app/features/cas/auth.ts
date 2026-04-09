const accessTokenPath = '/datasearch/skymaps_api/session/access_token'

let accessToken: string | undefined

export type CasCredentials = {
  authenticity_token: string
  source_origin: string
}

export class CasHttpError extends Error {
  readonly status: number
  readonly responseText: string

  constructor(message: string, status: number, responseText: string) {
    super(message)
    this.status = status
    this.responseText = responseText
  }
}

export async function withCasCredentials<T>(cb: (credentials: CasCredentials) => Promise<T>) {
  while (true) {
    try {
      const token = await getAccessToken()
      return await cb({
        authenticity_token: token,
        source_origin: location.origin,
      })
    }
    catch (error) {
      if (error instanceof CasHttpError && error.status === 401) {
        accessToken = undefined
        continue
      }
      throw error
    }
  }
}

async function getAccessToken() {
  if (accessToken !== undefined) {
    return accessToken
  }

  let sleep = 100
  for (let i = 0; i < 5; ++i) {
    try {
      const url = `${accessTokenPath}?source_origin=${encodeURIComponent(location.origin)}`
      const response = await fetch(url, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw await responseToError(response)
      }
      const result = await response.json() as { access_token: string }
      accessToken = result.access_token
      return accessToken
    }
    catch {
      await warmUpDatasearchSession(sleep *= 2)
    }
  }
  throw new Error('Cannot get access token for CAS')
}

async function warmUpDatasearchSession(ms: number) {
  const iframe = document.createElement('iframe')
  iframe.src = '/datasearch/'
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
  try {
    await delay(ms)
  }
  finally {
    document.body.removeChild(iframe)
  }
}

async function responseToError(response: Response) {
  const responseText = await response.text()
  return new CasHttpError(
    `CAS request failed: ${response.status} ${response.statusText}${responseText ? `\n${responseText}` : ''}`,
    response.status,
    responseText,
  )
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function ensureCasResponse(response: Response) {
  if (!response.ok) {
    throw await responseToError(response)
  }
  return response
}

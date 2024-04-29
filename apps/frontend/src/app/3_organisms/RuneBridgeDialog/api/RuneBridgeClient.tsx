export interface RequestOpts {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, any>;
  multipart?: boolean;
}

class ApiError extends Error {}

class RuneBridgeClient {
  private _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = this.sanitizeUrl(baseUrl);
  }

  private sanitizeUrl(url: string): string {
    return url.replace(/\/*$/, '');
  }
  set baseUrl(value: string) {
    this._baseUrl = this.sanitizeUrl(value);
  }
  get baseUrl() {
    return this._baseUrl;
  }

  async request(
    path: string,
    opts: RequestOpts = {},
  ): Promise<Record<string, any>> {
    return await this.requestRaw(path, opts)
      .then(async response => {
        if (!response.ok) {
          let message = '';
          try {
            const jsonData = await response.json();
            message = jsonData.error;
          } catch (e) {}
          if (!message) {
            message = await response.text();
          }
          throw new ApiError(message);
        }
        return await response.json();
      })
      .catch(error => {
        if (
          error instanceof TypeError &&
          (error.message.includes('Failed to fetch') ||
            error.message.includes(
              'NetworkError when attempting to fetch resource',
            ))
        ) {
          throw new ApiError(
            'Unable to connect to the server. Please try again later.',
          );
        }
        throw error;
      });
  }

  async requestRaw(path: string, opts: RequestOpts = {}): Promise<Response> {
    let { data, method = 'GET', multipart } = opts;
    const url = this.getApiUrl(path);

    const headers = new Headers();
    if (!multipart) {
      headers.set('Content-Type', 'application/json');
    }

    const fetchOpts: RequestInit = {
      method,
      credentials: 'include',
      mode: 'cors',
      headers,
    };
    if (data) {
      if (multipart) {
        fetchOpts.body = new FormData();
        for (const [key, value] of Object.entries(data)) {
          fetchOpts.body.append(key, value);
        }
      } else {
        fetchOpts.body = JSON.stringify(data);
      }
    }
    return await fetch(url, fetchOpts);
  }

  getApiUrl(path: string) {
    if (path.charAt(0) !== '/') {
      path = '/' + path;
    }
    return `${this.baseUrl}${path}`;
  }
}

export default RuneBridgeClient;

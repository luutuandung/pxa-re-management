import type { KyInstance } from 'ky';
import ky from 'ky';
import type { ApiClientConfig } from './api-client.type';

export const createApiClient = (config: ApiClientConfig = {}): KyInstance => {
  const defaultConfig = {
    baseUrl: config.baseUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    timeout: config.timeout || 30000,
    retryCount: config.retryCount || 3,
  };

  return ky.create({
    prefixUrl: defaultConfig.baseUrl,
    timeout: defaultConfig.timeout,
    retry: defaultConfig.retryCount,
    headers: {
      'Content-Type': 'application/json',
    },
    // MEMO: 認証機能が必要な場合に認証トークンの処理を行うhooksだけ形を残しておく
    // hooks: {
    //   beforeRequest: [
    //     (request) => {
    //       // 認証トークンの自動付与
    //       const token = localStorage.getItem('auth_token');
    //       if (token) {
    //         request.headers.set('Authorization', `Bearer ${token}`);
    //       }
    //     },
    //   ],
    // },
  });
};

// For multipart/form-data requests only (no default Content-Type header)
export const createMultipartApiClient = (config: ApiClientConfig = {}): KyInstance => {
  const defaultConfig = {
    baseUrl: config.baseUrl || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    timeout: config.timeout || 30000,
    retryCount: config.retryCount || 3,
  };
  return ky.create({
    prefixUrl: defaultConfig.baseUrl,
    timeout: defaultConfig.timeout,
    retry: defaultConfig.retryCount,
  });
};

export const api = createApiClient();

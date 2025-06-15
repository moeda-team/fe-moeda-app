import axios, { AxiosRequestConfig } from 'axios';

export const fetcher = async <T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME || '';
  const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD || '';

  const basicAuth = `Basic ${btoa(`${username}:${password}`)}`;

  const response = await axios.get<T>(url, {
    ...config,
    headers: {
      ...(config?.headers || {}),
      'Content-Type': 'application/json',
      Authorization: basicAuth
    },
    auth: {
      username: username,
      password: password
    }
  });

  return response.data;
};

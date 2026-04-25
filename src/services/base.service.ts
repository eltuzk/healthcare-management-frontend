import api from './api';

export class BaseService {
  protected static async get<T>(url: string, params?: any): Promise<T> {
    return api.get(url, { params });
  }

  protected static async post<T>(url: string, data?: any): Promise<T> {
    return api.post(url, data);
  }

  protected static async put<T>(url: string, data?: any): Promise<T> {
    return api.put(url, data);
  }

  protected static async delete<T>(url: string): Promise<T> {
    return api.delete(url);
  }

  protected static async patch<T>(url: string, data?: any): Promise<T> {
    return api.patch(url, data);
  }
}

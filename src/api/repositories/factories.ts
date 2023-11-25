import { AxiosInstance, AxiosRequestConfig } from "axios";

const factories = (axios: AxiosInstance) => (resource: string) => ({
  create(payload: any, config: AxiosRequestConfig = {}) {
    return axios.post(`${resource}`, payload, config);
  },

  post(payload: any, url?: string, config: AxiosRequestConfig = {}) {
    return axios.post(
      url ? `${resource}/${url}` : `${resource}`,
      payload,
      config
    );
  },

  getMany(config: AxiosRequestConfig = {}) {
    return axios.get(`${resource}`, config);
  },

  getOne(id: number | string | number, config: AxiosRequestConfig = {}) {
    return axios.get(`${resource}/${id}`, config);
  },

  get(url?: string, config: AxiosRequestConfig = {}) {
    return axios.get(url ? `${resource}/${url}` : `${resource}`, config);
  },

  update(payload: any, id: number | string, config: AxiosRequestConfig = {}) {
    return axios.patch(`${resource}/${id}`, payload, config);
  },

  put(payload: any, url?: string, config: AxiosRequestConfig = {}) {
    return axios.put(
      url ? `${resource}/${url}` : `${resource}`,
      payload,
      config
    );
  },

  patch(payload: any, url?: string, config: AxiosRequestConfig = {}) {
    return axios.patch(
      url ? `${resource}/${url}` : `${resource}`,
      payload,
      config
    );
  },

  delete(id: number | string, config: AxiosRequestConfig = {}) {
    return axios.delete(`${resource}/${id}`, config);
  },
});

export default factories;

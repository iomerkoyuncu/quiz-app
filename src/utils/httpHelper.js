import axios from 'axios';
import { appConfig } from '../constants/appConfig';

const createInstance = (baseURL, tokenName) => {
  const headers = {
    'content-type': 'application/json',
  };

  return axios.create({
    baseURL,
    headers,
    timeout: 10000,
  });
};

const httpHelper = {
  async makeRequest(
    method,
    baseURL,
    endPoint,
    tokenName,
    payload = {},
    config = {},
  ) {
    const instance = createInstance(baseURL, tokenName);

    try {
      const res = await instance({
        method,
        url: endPoint,
        data: payload,
        ...config,
      });
      return res;
    } catch (error) {
      this.errorHandling(error);
      return null;
    }
  },

  errorHandling(error) {
    let errorMessage = 'Bulunamadı';
    if (error.response) {
      errorMessage = error.response.data?.message;
      switch (error.response.status) {

        case 404:
          errorMessage = 'Bulunamadı';
          break;
        default:
          break;
      }
    } else {
      errorMessage = error.message;
    }
    console.error(errorMessage);
  },

  async makeGetRequest(
    baseURL = appConfig.baseUrl,
    endPoint,
    params = {},
    tokenName,
  ) {
    return this.makeRequest('get', baseURL, endPoint, tokenName, undefined, {
      params,
    });
  },

  async makePostRequest(
    baseURL,
    endPoint,
    payload = {},
    tokenName,
    config = {},
  ) {
    return this.makeRequest(
      'post',
      baseURL,
      endPoint,
      tokenName,
      payload,
      config,
    );
  },

  async makePutRequest(baseURL, endPoint, payload = {}, tokenName) {
    return this.makeRequest('put', baseURL, endPoint, tokenName, payload);
  },

  async makePatchRequest(baseURL, endPoint, payload = {}, tokenName) {
    return this.makeRequest('patch', baseURL, endPoint, tokenName, payload);
  },

  async makeDeleteRequest(baseURL, endPoint, tokenName) {
    return this.makeRequest('delete', baseURL, endPoint, tokenName);
  },
};

export default httpHelper;


// axiosInstance.js
import axios,{ AxiosInstance } from 'axios';
import config from "../../config.json"
import logger from './logger';

// Destructure necessary fields from config
const { url, apiUser, apiPass, basicAuth } = config.api;

// Initialize headers with Content-Type
const authHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
};

// Conditionally add the Authorization header
if (basicAuth) {
  const credentials = `${apiUser}:${apiPass}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');
  authHeaders['Authorization'] = `Basic ${encodedCredentials}`;
}

// Create Axios instance with conditional headers
const axiosInstance: AxiosInstance = axios.create({
  baseURL: url,
  headers: authHeaders,
  timeout: 10000,
});

// Add request interceptor for logging
axiosInstance.interceptors.request.use(
    (request) => {
      logger.info(`Starting Request: ${(request.method?.toUpperCase() || 'UNKNOWN')} ${request.url}`);
      return request;
    },
    (error) => {
      logger.error(`Request Error: ${error.message}`);
      return Promise.reject(error);
    }
  );
  
  // Add response interceptor for logging
  axiosInstance.interceptors.response.use(
    (response) => {
      logger.info(`Response: ${response.status} ${response.statusText}`);
      return response;
    },
    (error) => {
      if (error.response) {
        // Server responded with a status outside 2xx
        logger.error(`Response Error: ${error.response.status} ${error.response.statusText}`);
        logger.error(`Response Data: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // No response received
        logger.error('No response received:', error.request);
      } else {
        // Error setting up the request
        logger.error('Error:', error.message);
      }
      return Promise.reject(error);
    }
  );
export default axiosInstance;

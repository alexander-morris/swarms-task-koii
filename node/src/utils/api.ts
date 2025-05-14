import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const middleServerUrl = process.env.MIDDLE_SERVER_URL || 'http://localhost:3000';
const swarmsAdminKey = process.env.SWARMS_ADMIN_KEY;

if (!swarmsAdminKey) {
  console.warn('Warning: SWARMS_ADMIN_KEY not set. API calls to middle server will fail.');
}

// Create an axios instance with default config
const api = axios.create({
  baseURL: middleServerUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${swarmsAdminKey}`
  }
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          console.error('Authentication failed: Missing or invalid admin key');
          break;
        case 403:
          console.error('Authentication failed: Invalid bearer token');
          break;
        case 400:
          console.error('Validation error:', error.response.data.error);
          break;
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 
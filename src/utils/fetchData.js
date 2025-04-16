import axios from 'axios';

async function fetchData(url, config = {}) {
  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    // Handle different types of errors
    if (error.response) {
      // Server responded with a status code out of 2xx range
      console.error('Error Response:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // No response received after the request was made
      console.error('No response received:', error.request);
    } else {
      // Something else caused the error
      console.error('Error setting up request:', error.message);
    }

    // Optionally throw the error again or return a custom error object
    throw error;
  }
}

export default fetchData
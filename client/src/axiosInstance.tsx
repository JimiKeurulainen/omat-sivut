import axios from "axios";

const baseURL = process.env.REACT_APP_BASEURL ? process.env.REACT_APP_BASEURL : 'no env route';

export const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json'
  },
  // transformResponse: transform,
});

function transform(response: Response) {
  if (response.ok) {
    return {
      error: false,
      message: '',
      data: response
    }
  }
  else {
    return {
      error: true,
      message: '',
      data: response
    }
  }
}
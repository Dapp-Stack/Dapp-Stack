import axios from 'axios';

const BASE_URL = 'http://localhost:55555'

export const getTracker = () => {
  return axios.get(`${BASE_URL}/tracker`);
}
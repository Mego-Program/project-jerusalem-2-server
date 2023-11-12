import axios from 'axios';

const client = axios.create({
  baseURL: process.env.SERVER_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;

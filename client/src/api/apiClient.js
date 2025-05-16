// src/api/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://learn-rd8o.onrender.com/api', // Replace with your backend URL
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});


export default apiClient;

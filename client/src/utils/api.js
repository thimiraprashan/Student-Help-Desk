import axios from 'axios';
import { API_BASE_URL } from '../lib/backend.js';

const API = axios.create({
    baseURL: API_BASE_URL
});

export default API;

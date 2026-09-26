/**
 * Centralized API configuration for JanSathi.
 * Automatically handles local development and deployed production URLs.
 */

// If VITE_API_URL is provided, normalize it by stripping any trailing slashes and trailing '/api'
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

// Full API endpoint base (e.g. "https://api.yourdomain.com/api" or "http://localhost:5000/api")
export const API_BASE_URL = `${BASE_URL}/api`;

export default {
  BASE_URL,
  API_BASE_URL
};

/**
 * Centralized API configuration for JanSathi.
 * Automatically handles local development and deployed production URLs.
 */

const rawUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').trim();

// Strip any trailing '/api' and trailing slashes
let cleanUrl = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

// If it's a domain name without protocol (e.g. from Render Blueprint host property), prepend https://
if (cleanUrl && !cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
  cleanUrl = `https://${cleanUrl}`;
}

export const BASE_URL = cleanUrl;
export const API_BASE_URL = `${BASE_URL}/api`;

export default {
  BASE_URL,
  API_BASE_URL
};

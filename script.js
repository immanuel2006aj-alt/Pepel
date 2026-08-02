// ============================================================
// PEPEL – Shared JavaScript
// ============================================================

// ---------- BACKEND URL ----------
// Change this to your actual Render backend URL
const BACKEND_URL = 'https://pepel-backend.onrender.com';

// ---------- TOKEN MANAGEMENT ----------
function getToken() {
  return localStorage.getItem('pepel_token');
}

function setToken(token) {
  localStorage.setItem('pepel_token', token);
}

function clearToken() {
  localStorage.removeItem('pepel_token');
  localStorage.removeItem('pepel_worker_id');
}

function getWorkerId() {
  return localStorage.getItem('pepel_worker_id');
}

function setWorkerId(id) {
  localStorage.setItem('pepel_worker_id', id);
}

function isLoggedIn() {
  return !!getToken();
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// ---------- API HELPER (with token) ----------
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (response.status === 401) {
    clearToken();
    window.location.href = 'login.html';
    throw new Error('Unauthorized');
  }
  return response;
}

// ---------- TOAST NOTIFICATIONS ----------
function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#f97316'};
    color: white; padding: 12px 24px; border-radius: 40px;
    font-weight: 500; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    z-index: 999; max-width: 90%; text-align: center;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ---------- DATE FORMATTER ----------
function formatDate(ts) {
  return new Date(ts).toLocaleString();
}

// ---------- LOGOUT (commonly used) ----------
function logout() {
  clearToken();
  window.location.href = 'login.html';
}

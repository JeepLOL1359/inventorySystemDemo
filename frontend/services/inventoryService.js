const API_URL = 'http://127.0.0.1:8000';

// ── Items ────────────────────────────────────────────

export const getAllItems = async () => {
  const response = await fetch(`${API_URL}/items`);
  if (!response.ok) throw new Error('Failed to fetch items');
  return response.json();
};

export const getItemById = async (id) => {
  const response = await fetch(`${API_URL}/items/${id}`);
  if (!response.ok) throw new Error('Failed to fetch item');
  return response.json();
};

export const createItem = async (itemData) => {
  const response = await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData),
  });
  if (!response.ok) throw new Error('Failed to create item');
  return response.json();
};

export const updateItem = async (id, updates) => {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update item');
  return response.json();
};

export const deleteItem = async (id) => {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete item');
  return response.json();
};

export const adjustQuantity = async (id, change) => {
  const response = await fetch(`${API_URL}/items/${id}/adjust-quantity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity_change: change }),
  });
  if (!response.ok) throw new Error('Failed to adjust quantity');
  return response.json();
};

// ── Categories ───────────────────────────────────────

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  const data = await response.json();
  return data.categories;
};

// ── Search ───────────────────────────────────────────

export const searchItems = async (query = '', category = '') => {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (category) params.append('category', category);
  
  const response = await fetch(`${API_URL}/search?${params}`);
  if (!response.ok) throw new Error('Failed to search items');
  return response.json();
};

// ── Stats ────────────────────────────────────────────

export const getStats = async () => {
  const response = await fetch(`${API_URL}/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};
const API_BASE_URL = '/api';

// Helper function to get headers with authorization
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth && typeof window !== 'undefined') {
    const token = window.localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Auth API calls
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error('Login failed');
  return response.json();
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
};

// Grievance API calls
export const fetchGrievances = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/grievances?${params}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch grievances');
    }

    const data = await response.json();
    return data; // Return the complete response with grievances and pagination
  } catch (error) {
    console.error('Fetch grievances error:', error);
    throw error;
  }
};

export const fetchGrievanceById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/grievances/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch grievance');
  return response.json();
};

export const createGrievance = async (grievanceData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/grievances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(grievanceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create grievance');
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Create grievance error:', error);
    throw error;
  }
};

export const updateGrievance = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/grievances/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update grievance');
  }
  return response.json();
};

export const deleteGrievance = async (id) => {
  const response = await fetch(`${API_BASE_URL}/grievances/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete grievance');
  }
  return response.json();
};

export const updateGrievanceStatus = async (grievanceId, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/grievances/${grievanceId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update grievance status');
    }

    return response.json();
  } catch (error) {
    console.error('Update grievance status error:', error);
    throw error;
  }
};

// Admin API calls
export const fetchAdmins = async () => {
  const response = await fetch(`${API_BASE_URL}/admins`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch admins');
  return response.json();
};

export const createAdmin = async (adminData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admins`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(adminData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create admin');
    }

    return data;
  } catch (error) {
    console.error('Create admin error:', error);
    throw error;
  }
};

export const updateAdmin = async (id, updates) => {
  const response = await fetch(`${API_BASE_URL}/admins`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ id, ...updates }),
  });
  if (!response.ok) throw new Error('Failed to update admin');
  return response.json();
};

export const deleteAdmin = async (id) => {
  const response = await fetch(`${API_BASE_URL}/admins`, {
    method: 'DELETE',
    headers: getHeaders(),
    body: JSON.stringify({ id }),
  });
  if (!response.ok) throw new Error('Failed to delete admin');
  return response.json();
};

// Analytics API calls
export const fetchDepartmentAnalytics = async (department) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/${department}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch analytics');
    }

    return response.json();
  } catch (error) {
    console.error('Fetch analytics error:', error);
    throw error;
  }
}; 
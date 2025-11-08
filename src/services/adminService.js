import api from '../utils/api';

export const adminService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/admin/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_data', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Create Admin
  createAdmin: async (name, email, password, role) => {
    const response = await api.post('/admin/create', { name, email, password, role });
    return response.data;
  },

  // Get Profile
  getProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  },

  // Update Profile
  updateProfile: async (name, email) => {
    const response = await api.put('/admin/profile', { name, email });
    return response.data;
  },

  // Change Password
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    const response = await api.put('/admin/password', {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  // Get All Admins
  getAllAdmins: async () => {
    const response = await api.get('/admin/all');
    return response.data;
  },

  // Get Admin By ID
  getAdminById: async (adminId) => {
    const response = await api.get(`/admin/${adminId}`);
    return response.data;
  },

  // Update Admin Role
  updateAdminRole: async (adminId, role) => {
    const response = await api.put(`/admin/${adminId}/role`, { role });
    return response.data;
  },

  // Update Permissions
  updatePermissions: async (adminId, permissions) => {
    const response = await api.put(`/admin/${adminId}/permissions`, permissions);
    return response.data;
  },

  // Deactivate Admin
  deactivateAdmin: async (adminId) => {
    const response = await api.put(`/admin/${adminId}/deactivate`);
    return response.data;
  },

  // Activate Admin
  activateAdmin: async (adminId) => {
    const response = await api.put(`/admin/${adminId}/activate`);
    return response.data;
  },

  // Delete Admin
  deleteAdmin: async (adminId) => {
    const response = await api.delete(`/admin/${adminId}`);
    return response.data;
  },


// Add this to adminService object
updateAdmin: async (adminId, name, email, password) => {
  const data = {};
  if (name) data.name = name;
  if (email) data.email = email;
  if (password) data.password = password;
  
  const response = await api.put(`/admin/${adminId}`, data);
  return response.data;
},  

  // Logout
  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
  },
};
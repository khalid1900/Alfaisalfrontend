import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { adminService } from '../services/adminService';
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  Shield, 
  Crown, 
  Lock, 
  Unlock,
  Search,
  X,
  AlertCircle
} from 'lucide-react';

export default function ManageAdmins() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
  });

  // Permissions state
  const [permissions, setPermissions] = useState({
    createEvent: true,
    editEvent: true,
    deleteEvent: false,
    viewAllEvents: true,
    approveEvent: false,
    rejectEvent: false,
    viewAttendees: true,
    manageAdmins: false,
    viewReports: true,
  });

//   useEffect(() => {
//     if (user?.role !== 'superadmin') {
//       alert('Access Denied: Super Admin only');
//       navigate('/admin/dashboard');
//     }
//   }, [user, navigate]);

  // Fetch admins
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllAdmins();
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      alert(error.response?.data?.message || 'Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await adminService.createAdmin(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      alert('Admin created successfully!');
      setShowCreateForm(false);
      resetForm();
      await fetchAdmins();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create admin');
    }
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Update admin details
      await adminService.updateAdmin(
        editingAdmin._id,
        formData.name,
        formData.email,
        formData.password || undefined
      );
      
      // Update role if changed
      if (formData.role !== editingAdmin.role) {
        await adminService.updateAdminRole(editingAdmin._id, formData.role);
      }
      
      alert('Admin updated successfully!');
      setEditingAdmin(null);
      setShowCreateForm(false);
      resetForm();
      await fetchAdmins();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update admin');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (adminId === user?._id) {
      alert('You cannot delete your own account!');
      return;
    }
    if (window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      try {
        await adminService.deleteAdmin(adminId);
        alert('Admin deleted successfully!');
        await fetchAdmins();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete admin');
      }
    }
  };

  const handleToggleStatus = async (adminId, currentStatus) => {
    if (adminId === user?._id) {
      alert('You cannot deactivate your own account!');
      return;
    }
    try {
      if (currentStatus) {
        await adminService.deactivateAdmin(adminId);
        alert('Admin deactivated successfully!');
      } else {
        await adminService.activateAdmin(adminId);
        alert('Admin activated successfully!');
      }
      await fetchAdmins();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update admin status');
    }
  };

  const handleUpdateRole = async (adminId, newRole) => {
    if (adminId === user?._id) {
      alert('You cannot change your own role!');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to change this admin's role to ${newRole}?`)) {
      return;
    }

    try {
      await adminService.updateAdminRole(adminId, newRole);
      alert('Role updated successfully!');
      await fetchAdmins();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleOpenPermissions = (admin) => {
    setSelectedAdmin(admin);
    setPermissions(admin.permissions || permissions);
    setShowPermissionsModal(true);
  };

  const handleUpdatePermissions = async () => {
    try {
      await adminService.updatePermissions(selectedAdmin._id, permissions);
      alert('Permissions updated successfully!');
      setShowPermissionsModal(false);
      await fetchAdmins();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update permissions');
    }
  };

  const handleOpenCreateForm = () => {
    resetForm();
    setEditingAdmin(null);
    setShowCreateForm(true);
  };

  const handleOpenEditForm = (admin) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      role: admin.role,
    });
    setEditingAdmin(admin);
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'admin',
    });
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || admin.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-purple-200 hover:text-white mb-4 transition"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Crown size={24} />
                Admin Management
              </h2>
              <p className="text-purple-200 text-sm">Manage admin accounts and permissions</p>
            </div>
            <button
              onClick={handleOpenCreateForm}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-purple-900 px-4 py-2 rounded-lg font-semibold transition"
            >
              <Plus size={20} /> Create Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
            <p className="text-sm font-semibold opacity-80">Total Admins</p>
            <p className="text-4xl font-bold mt-2 text-purple-700">{admins.length}</p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <p className="text-sm font-semibold opacity-80">Active</p>
            <p className="text-4xl font-bold mt-2 text-green-700">
              {admins.filter(a => a.isActive).length}
            </p>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <p className="text-sm font-semibold opacity-80">Inactive</p>
            <p className="text-4xl font-bold mt-2 text-red-700">
              {admins.filter(a => !a.isActive).length}
            </p>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Filter Bar */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search admins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-purple-700"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-purple-700"
              >
                <option value="all">All Roles</option>
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">Last Login</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-600">
                      Loading...
                    </td>
                  </tr>
                ) : filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-600">
                      No admins found
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <tr key={admin._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {admin.name}
                          </span>
                          {admin._id === user?._id && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {admin.role === 'superadmin' ? (
                            <>
                              <Crown size={16} className="text-yellow-600" />
                              <select
                                value={admin.role}
                                onChange={(e) => handleUpdateRole(admin._id, e.target.value)}
                                disabled={admin._id === user?._id}
                                className={`text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded border-none ${
                                  admin._id === user?._id ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                                }`}
                              >
                                <option value="superadmin">Super Admin</option>
                                <option value="admin">Admin</option>
                              </select>
                            </>
                          ) : (
                            <>
                              <Shield size={16} className="text-blue-600" />
                              <select
                                value={admin.role}
                                onChange={(e) => handleUpdateRole(admin._id, e.target.value)}
                                className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded border-none cursor-pointer"
                              >
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super Admin</option>
                              </select>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            admin.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEditForm(admin)}
                            className="p-2 text-orange-700 hover:bg-orange-50 rounded transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>

                          {/* Permissions Button */}
                          {admin.role === 'admin' && (
                            <button
                              onClick={() => handleOpenPermissions(admin)}
                              className="p-2 text-purple-700 hover:bg-purple-50 rounded transition"
                              title="Manage Permissions"
                            >
                              <Shield size={18} />
                            </button>
                          )}

                          {/* Toggle Status Button */}
                          <button
                            onClick={() => handleToggleStatus(admin._id, admin.isActive)}
                            disabled={admin._id === user?._id}
                            className={`p-2 rounded transition ${
                              admin._id === user?._id
                                ? 'text-gray-400 cursor-not-allowed'
                                : admin.isActive
                                ? 'text-yellow-700 hover:bg-yellow-50'
                                : 'text-green-700 hover:bg-green-50'
                            }`}
                            title={admin.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {admin.isActive ? <Lock size={18} /> : <Unlock size={18} />}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteAdmin(admin._id)}
                            disabled={admin._id === user?._id}
                            className={`p-2 rounded transition ${
                              admin._id === user?._id
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-red-700 hover:bg-red-50'
                            }`}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create/Edit Admin Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
            <div className="bg-purple-900 text-white p-6 flex justify-between items-center rounded-t-lg">
              <h2 className="text-2xl font-bold">
                {editingAdmin ? 'Edit Admin' : 'Create New Admin'}
              </h2>
              <button onClick={() => { setShowCreateForm(false); resetForm(); }} className="text-2xl hover:opacity-80">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={editingAdmin ? handleUpdateAdmin : handleCreateAdmin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-purple-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-purple-700"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Password {editingAdmin ? '(Leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-purple-700"
                  placeholder={editingAdmin ? 'Leave blank to keep current' : 'Min. 6 characters'}
                  required={!editingAdmin}
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-purple-700"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-300">
                <button
                  type="button"
                  onClick={() => { setShowCreateForm(false); resetForm(); }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded text-gray-900 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-700 text-white rounded font-semibold hover:bg-purple-800 transition"
                >
                  {editingAdmin ? 'Update Admin' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
            <div className="bg-purple-900 text-white p-6 flex justify-between items-center rounded-t-lg">
              <h2 className="text-2xl font-bold">Manage Permissions: {selectedAdmin.name}</h2>
              <button onClick={() => setShowPermissionsModal(false)} className="text-2xl hover:opacity-80">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="text-blue-600 mr-3 mt-0.5" size={20} />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold">Permission Settings</p>
                    <p>Configure what this admin can do in the system</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(permissions).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setPermissions({ ...permissions, [key]: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-300">
                <button
                  type="button"
                  onClick={() => setShowPermissionsModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded text-gray-900 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdatePermissions}
                  className="flex-1 px-4 py-2 bg-purple-700 text-white rounded font-semibold hover:bg-purple-800 transition"
                >
                  Update Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
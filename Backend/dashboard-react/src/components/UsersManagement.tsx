import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../apiService';

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await apiService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiService.deleteUser(userId);
        loadUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h2>Users Management</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Phone</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Role</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Verified</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{user.name}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{user.email}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{user.phone}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{user.role}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                {user.isVerified ? 'Yes' : 'No'}
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    background: '#dc3545',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersManagement;
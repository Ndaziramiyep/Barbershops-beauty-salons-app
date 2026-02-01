import React, { useState, useEffect } from 'react';
import { Salon } from '../types';
import { apiService } from '../apiService';

const SalonsManagement: React.FC = () => {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSalons();
  }, []);

  const loadSalons = async () => {
    try {
      const data = await apiService.getAllSalons();
      setSalons(data);
    } catch (error) {
      console.error('Failed to load salons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSalon = async (salonId: string) => {
    try {
      await apiService.approveSalon(salonId, true);
      loadSalons();
    } catch (error) {
      console.error('Failed to approve salon:', error);
    }
  };

  const handleDeleteSalon = async (salonId: string) => {
    if (window.confirm('Are you sure you want to delete this salon?')) {
      try {
        await apiService.deleteSalon(salonId);
        loadSalons();
      } catch (error) {
        console.error('Failed to delete salon:', error);
      }
    }
  };

  if (loading) return <div>Loading salons...</div>;

  return (
    <div>
      <h2>Salons Management</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Owner</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Address</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Phone</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salons.map((salon) => (
            <tr key={salon._id}>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{salon.name}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                {salon.ownerId?.name || 'N/A'}
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{salon.address}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{salon.phone}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                {salon.isApproved ? 'Approved' : 'Pending'}
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                {!salon.isApproved && (
                  <button
                    onClick={() => handleApproveSalon(salon._id)}
                    style={{
                      padding: '6px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      background: '#28a745',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '12px',
                      marginRight: '8px'
                    }}
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleDeleteSalon(salon._id)}
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

export default SalonsManagement;
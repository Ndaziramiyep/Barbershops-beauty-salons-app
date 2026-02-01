import React, { useState, useEffect } from 'react';
import { Salon } from '../types';
import { apiService } from '../apiService';

const SalonProfile: React.FC = () => {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await apiService.getSalonProfile();
      setSalon(data);
    } catch (error) {
      console.error('Failed to load salon profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!salon) return;

    setSaving(true);
    try {
      const updated = await apiService.updateSalonProfile({
        name: salon.name,
        address: salon.address,
        phone: salon.phone,
        email: salon.email
      });
      setSalon(updated);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Salon, value: string) => {
    if (salon) {
      setSalon({ ...salon, [field]: value });
    }
  };

  if (loading) return <div>Loading salon profile...</div>;
  if (!salon) return <div>Salon not found</div>;

  return (
    <div>
      <h2>Salon Profile</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Salon Name:
          </label>
          <input
            type="text"
            value={salon.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Address:
          </label>
          <textarea
            value={salon.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            required
            rows={3}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Phone:
          </label>
          <input
            type="tel"
            value={salon.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Email:
          </label>
          <input
            type="email"
            value={salon.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            background: '#28a745',
            color: 'white',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default SalonProfile;
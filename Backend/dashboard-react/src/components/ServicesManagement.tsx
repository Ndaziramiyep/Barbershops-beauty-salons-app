import React, { useState, useEffect } from 'react';
import { Salon, Service } from '../types';
import { apiService } from '../apiService';

const ServicesManagement: React.FC = () => {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: 0, duration: 0 });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await apiService.getSalonProfile();
      setSalon(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await apiService.addService(newService);
      setSalon(updated);
      setNewService({ name: '', price: 0, duration: 0 });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add service:', error);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const updated = await apiService.deleteService(serviceId);
        setSalon(updated);
      } catch (error) {
        console.error('Failed to delete service:', error);
      }
    }
  };

  if (loading) return <div>Loading services...</div>;
  if (!salon) return <div>Salon not found</div>;

  return (
    <div>
      <h2>Services Management</h2>
      
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        style={{
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          background: '#28a745',
          color: 'white',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        {showAddForm ? 'Cancel' : 'Add Service'}
      </button>

      {showAddForm && (
        <form onSubmit={handleAddService} style={{ 
          marginBottom: '30px', 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>Add New Service</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Service Name:
              </label>
              <input
                type="text"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Price ($):
              </label>
              <input
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                required
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Duration (minutes):
              </label>
              <input
                type="number"
                value={newService.duration}
                onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                required
                min="1"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              background: '#007bff',
              color: 'white',
              cursor: 'pointer',
              marginTop: '15px'
            }}
          >
            Add Service
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gap: '15px' }}>
        {salon.services.map((service) => (
          <div key={service._id} style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0' }}>{service.name}</h4>
              <p style={{ margin: '0', color: '#666' }}>
                Price: ${service.price} | Duration: {service.duration} minutes
              </p>
            </div>
            <button
              onClick={() => handleDeleteService(service._id)}
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
          </div>
        ))}
      </div>

      {salon.services.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
          No services added yet. Click "Add Service" to get started.
        </p>
      )}
    </div>
  );
};

export default ServicesManagement;
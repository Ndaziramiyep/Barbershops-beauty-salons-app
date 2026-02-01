import React, { useState, useEffect } from 'react';
import { User, DashboardStats } from '../types';
import { apiService } from '../apiService';
import UsersManagement from './UsersManagement';
import SalonsManagement from './SalonsManagement';
import BookingsManagement from './BookingsManagement';
import SalonProfile from './SalonProfile';
import ServicesManagement from './ServicesManagement';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({});

  useEffect(() => {
    loadStats();
  }, [user.role]);

  const loadStats = async () => {
    try {
      const data = user.role === 'admin' 
        ? await apiService.getAdminStats()
        : await apiService.getSalonOwnerStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const renderStats = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2em', fontWeight: 'bold' }}>{value}</div>
          <div style={{ marginTop: '5px', opacity: 0.9 }}>
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div>
            <h2>Dashboard Overview</h2>
            {renderStats()}
          </div>
        );
      case 'users':
        return user.role === 'admin' ? <UsersManagement /> : null;
      case 'salons':
        return user.role === 'admin' ? <SalonsManagement /> : null;
      case 'bookings':
        return <BookingsManagement userRole={user.role} />;
      case 'profile':
        return user.role === 'salon_owner' ? <SalonProfile /> : null;
      case 'services':
        return user.role === 'salon_owner' ? <ServicesManagement /> : null;
      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1>SalonEase Dashboard</h1>
        <p>Welcome, {user.name} ({user.role})</p>
        
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <button
            onClick={() => setActiveSection('overview')}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: activeSection === 'overview' ? '#0056b3' : '#007bff',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Overview
          </button>
          
          {user.role === 'admin' && (
            <>
              <button
                onClick={() => setActiveSection('users')}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  background: activeSection === 'users' ? '#0056b3' : '#007bff',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Users
              </button>
              <button
                onClick={() => setActiveSection('salons')}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  background: activeSection === 'salons' ? '#0056b3' : '#007bff',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Salons
              </button>
            </>
          )}
          
          <button
            onClick={() => setActiveSection('bookings')}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: activeSection === 'bookings' ? '#0056b3' : '#007bff',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Bookings
          </button>
          
          {user.role === 'salon_owner' && (
            <>
              <button
                onClick={() => setActiveSection('profile')}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  background: activeSection === 'profile' ? '#0056b3' : '#007bff',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Salon Profile
              </button>
              <button
                onClick={() => setActiveSection('services')}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  background: activeSection === 'services' ? '#0056b3' : '#007bff',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Services
              </button>
            </>
          )}
          
          <button
            onClick={onLogout}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: '#dc3545',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: 'auto'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
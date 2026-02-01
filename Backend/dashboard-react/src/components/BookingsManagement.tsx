import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { apiService } from '../apiService';

interface BookingsManagementProps {
  userRole: 'admin' | 'salon_owner';
}

const BookingsManagement: React.FC<BookingsManagementProps> = ({ userRole }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [userRole]);

  const loadBookings = async () => {
    try {
      const data = userRole === 'admin' 
        ? await apiService.getAdminBookings()
        : await apiService.getSalonBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      await apiService.updateBookingStatus(bookingId, status);
      loadBookings();
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div>
      <h2>Bookings Management</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Customer</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Salon</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Service</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Time</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                {booking.userId?.name || 'N/A'}
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                {booking.salonId?.name || 'N/A'}
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{booking.serviceName}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                {new Date(booking.date).toLocaleDateString()}
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{booking.time}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{booking.status}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                {userRole === 'salon_owner' && booking.status === 'pending' ? (
                  <div>
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
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
                      Confirm
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'cancelled')}
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
                      Cancel
                    </button>
                  </div>
                ) : (
                  'N/A'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsManagement;
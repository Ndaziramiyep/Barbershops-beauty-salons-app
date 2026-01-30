import React from 'react';
import ProtectedRoute from '../src/components/ProtectedRoute';
import HomeScreen from '../src/screens/home/HomeScreen';

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeScreen />
    </ProtectedRoute>
  );
}
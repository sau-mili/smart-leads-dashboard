// frontend/src/App.tsx
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast'; // 1. Import the Toaster

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <>
      {/* 2. Add the Toaster component so it sits above your whole app */}
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          style: { background: '#333', color: '#fff', borderRadius: '10px' }
        }} 
      />
      
      {!token ? (
        <Login onSuccess={(newToken) => setToken(newToken)} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
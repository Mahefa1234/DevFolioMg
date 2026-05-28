// src/pages/AuthCallback.jsx
// Page intermédiaire qui récupère le token Google et redirige vers le dashboard

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    const error = params.get('error');

    if (error) {
      toast.error('Erreur de connexion Google');
      navigate('/auth');
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        loginUser(token, user);
        toast.success(`Bienvenue, ${user.prenom} ! 🎉`);
        navigate('/dashboard');
      } catch {
        toast.error('Erreur de connexion');
        navigate('/auth');
      }
    } else {
      navigate('/auth');
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f5f0] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#1d6a40] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-[#9a9a8a] font-mono">Connexion en cours...</p>
      </div>
    </div>
  );
}

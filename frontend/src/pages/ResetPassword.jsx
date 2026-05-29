// frontend/src/pages/ResetPassword.jsx
import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const strength = () => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  const colors = ['#ef4444','#f97316','#eab308','#22c55e'];
  const labels = ['Très faible','Faible','Moyen','Fort'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm)
      return toast.error('Les mots de passe ne correspondent pas');
    if (password.length < 8)
      return toast.error('Minimum 8 caractères');
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, { token, password });
      loginUser(res.data.token, res.data.user);
      toast.success('Mot de passe modifié !');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Token invalide ou expiré');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return (
    <div className="min-h-screen bg-[#f6f5f0] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#9a9a8a] mb-4">Lien invalide</p>
        <Link to="/auth" className="text-[#1d6a40] font-semibold hover:underline">Retour</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f5f0] flex flex-col">
      <nav className="h-[60px] bg-[#f6f5f0]/90 backdrop-blur border-b border-[#e2e1d8] flex items-center justify-center px-6 sticky top-0 z-50">
        <span className="font-mono text-sm font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#25a058] inline-block animate-pulse"></span>
          DevFolioMG
        </span>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[400px]">
          <div className="bg-white rounded-2xl border border-[#e2e1d8] p-8">
            <h2 className="font-serif text-xl font-normal mb-1">Nouveau mot de passe</h2>
            <p className="text-sm text-[#4a4a40] mb-6">Choisis un mot de passe sécurisé.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[0.68rem] font-semibold text-[#9a9a8a] uppercase tracking-widest mb-1.5">Nouveau mot de passe</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 caractères" required
                  className="w-full px-4 py-2.5 bg-[#f6f5f0] border border-[#e2e1d8] rounded-xl text-sm outline-none focus:border-[#1d6a40] transition-all"/>
                {password && (
                  <>
                    <div className="flex gap-1 mt-1.5">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-1 flex-1 rounded-full transition-all"
                          style={{background: i <= strength() ? colors[strength()-1] : '#e2e1d8'}}></div>
                      ))}
                    </div>
                    <p className="text-xs mt-1" style={{color: strength() > 0 ? colors[strength()-1] : '#9a9a8a'}}>
                      {labels[strength()-1] || ''}
                    </p>
                  </>
                )}
              </div>
              <div>
                <label className="block text-[0.68rem] font-semibold text-[#9a9a8a] uppercase tracking-widest mb-1.5">Confirmer</label>
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Répète le mot de passe" required
                  className="w-full px-4 py-2.5 bg-[#f6f5f0] border border-[#e2e1d8] rounded-xl text-sm outline-none focus:border-[#1d6a40] transition-all"/>
                {confirm && password !== confirm && (
                  <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                )}
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-[#1a1a14] text-white rounded-full text-sm font-semibold hover:bg-[#2a2a20] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><span className="animate-spin">⟳</span> Modification...</> : '✓ Modifier le mot de passe'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

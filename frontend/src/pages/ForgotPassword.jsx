// frontend/src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
      setSent(true);
      toast.success('Email envoyé !');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f5f0] flex flex-col">
      <nav className="h-[60px] bg-[#f6f5f0]/90 backdrop-blur border-b border-[#e2e1d8] flex items-center justify-between px-6 sticky top-0 z-50">
        <Link to="/auth" className="text-[#9a9a8a] text-sm hover:text-[#1a1a14] transition-colors">← Retour</Link>
        <span className="font-mono text-sm font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#25a058] inline-block animate-pulse"></span>
          DevFolioMG
        </span>
        <span className="w-16"></span>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[400px]">
          <div className="bg-white rounded-2xl border border-[#e2e1d8] p-8">
            {sent ? (
              <div className="text-center">
                <div className="text-4xl mb-4">📧</div>
                <h2 className="font-serif text-xl font-normal mb-2">Email envoyé !</h2>
                <p className="text-sm text-[#4a4a40] mb-4 leading-relaxed">
                  Vérifie ta boîte mail — tu recevras un lien pour réinitialiser ton mot de passe dans quelques minutes.
                </p>
                <Link to="/auth" className="text-sm text-[#1d6a40] font-semibold hover:underline">
                  Retour à la connexion
                </Link>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-xl font-normal mb-1">Mot de passe oublié ?</h2>
                <p className="text-sm text-[#4a4a40] mb-6">Entre ton email et on t'envoie un lien de réinitialisation.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[0.68rem] font-semibold text-[#9a9a8a] uppercase tracking-widest mb-1.5">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="ton@email.com" required
                      className="w-full px-4 py-2.5 bg-[#f6f5f0] border border-[#e2e1d8] rounded-xl text-sm outline-none focus:border-[#1d6a40] transition-all"/>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-2.5 bg-[#1a1a14] text-white rounded-full text-sm font-semibold hover:bg-[#2a2a20] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><span className="animate-spin">⟳</span> Envoi...</> : '📧 Envoyer le lien'}
                  </button>
                </form>
                <p className="text-center text-sm text-[#4a4a40] mt-4">
                  <Link to="/auth" className="text-[#1d6a40] font-semibold hover:underline">← Retour</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
